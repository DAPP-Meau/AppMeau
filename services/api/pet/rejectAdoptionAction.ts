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
//import { isrejectedInPet } from "@/utils/isrejectedInPet"
import getPetAction from "./getPetAction"
//import { createrejectedPushMessage } from "../messaging/createPushMessage"
import { setUninterested } from "./toggleInterestedInPet"

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
const setrejected = async (
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
 * @param petID Id do pet
 * @param userID Id do usuário
 * @param firebaseApp instância do firebase
 *
 * @throws {Error} caso não haja usuário logado, ou o documento petID não exista
 */
export async function rejectAdoptionAction(
  petID: string,
  userID: string,
  firebaseApp: FirebaseApp,
): Promise<void> {
  const db = getFirestore(firebaseApp)
  const petDocumentRef = doc(db, collectionPaths.pets, petID)

  const pet = await getPetAction(petID, firebaseApp)
  if (!pet) throw new Error("The pet that uses this petID does not exist!")

  setrejected(pet, petDocumentRef, userID)
  setUninterested(pet, petDocumentRef, userID)
}
