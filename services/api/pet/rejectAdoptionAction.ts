import { FirebaseApp } from "firebase/app"
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentReference,
  getFirestore,
  updateDoc,
} from "firebase/firestore"
import { Pet } from "@/models"
import { collectionPaths } from "@/constants"
import { listRemove, listUnion } from "@/utils/listUtils"
import getPetAction from "./getPetAction"
import { setUninterested } from "./toggleInterestedInPet"
import deleteRoomById from "../chat/deleteRoomById"

/** Função auxiliar */
const setUnrejected = async (
  pet: Pet,
  petDocumentRef: DocumentReference,
  loggedInUserUID: string,
): Promise<string[]> => {
  const rejectedUserList: Pick<Pet, "rejectedUsersList"> = {
    // @ts-expect-error  2322
    rejectedUsersList: arrayRemove(loggedInUserUID),
  }
  // Atualizar documento no firebase
  await updateDoc(petDocumentRef, rejectedUserList)

  //Atualizar lista de pets locais
  return listRemove(pet.rejectedUsersList, loggedInUserUID)
}

/** Função auxiliar */
const setRejected = async (
  pet: Pet,
  petDocumentRef: DocumentReference,
  loggedInUserUID: string,
): Promise<string[]> => {
  const rejectedUserList: Pick<Pet, "rejectedUsersList"> = {
    // @ts-expect-error  2322
    rejectedUsersList: arrayUnion(loggedInUserUID),
  }
  // Atualizar documento no firebase
  await updateDoc(petDocumentRef, rejectedUserList)

  //Atualizar lista de pets locais
  return listUnion(pet.rejectedUsersList, loggedInUserUID)
}

/** Rejeita o usuário no pet.
 *
 * retira o usuário dos interessados no pet, movendo o ID para a lista de
 * rejeitados e por fim deleta o chat.
 *
 * @param petID Id do pet
 * @param userID Id do usuário
 * @param roomID sala com o usuário
 * @param firebaseApp instância do firebase
 *
 * @throws {Error} caso não haja usuário logado, ou o documento petID não exista
 */
export async function rejectAdoptionAction(
  petID: string,
  userID: string,
  roomID: string,
  firebaseApp: FirebaseApp,
): Promise<void> {
  const db = getFirestore(firebaseApp)
  const petDocumentRef = doc(db, collectionPaths.pets, petID)

  const pet = await getPetAction(petID, firebaseApp)
  if (!pet) throw new Error("The pet that uses this petID does not exist!")

  setRejected(pet, petDocumentRef, userID)
  setUninterested(pet, petDocumentRef, userID)
  deleteRoomById(roomID, firebaseApp)
}
