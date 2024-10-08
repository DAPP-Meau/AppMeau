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
import { getAuth } from "firebase/auth"
import { collectionPaths } from "@/constants"
import { listRemove, listUnion } from "@/utils/listUtils"
import { isInterestedInPet } from "@/utils/isInterestedInPet"
import getPetAction from "./getPetAction"
import { createInterestedPushMessage } from "../messaging/createPushMessage"
import sendPushNotification from "../messaging/sendPushNotification"

/** Função auxiliar */
export const setUninterested = async (
  pet: Pet,
  petDocumentRef: DocumentReference,
  loggedInUserUID: string,
): Promise<string[]> => {
  const interestedUserList: Pick<Pet, "interestedUsersList"> = {
    // @ts-expect-error  2322
    interestedUsersList: arrayRemove(loggedInUserUID),
  }
  // Atualizar documento no firebase
  await updateDoc(petDocumentRef, interestedUserList)

  //Atualizar lista de pets locais
  return listRemove(pet.interestedUsersList, loggedInUserUID)
}

/** Função auxiliar */
export const setInterested = async (
  pet: Pet,
  petDocumentRef: DocumentReference,
  loggedInUserUID: string,
): Promise<string[]> => {
  const interestedUserList: Pick<Pet, "interestedUsersList"> = {
    // @ts-expect-error  2322
    interestedUsersList: arrayUnion(loggedInUserUID),
  }
  // Atualizar documento no firebase
  await updateDoc(petDocumentRef, interestedUserList)

  //Atualizar lista de pets locais
  return listUnion(pet.interestedUsersList, loggedInUserUID)
}

/** Troca o estado de interesse do usuário no pet.
 *
 * @param firebaseApp Objeto do firebase
 * @param petID Id do documento do pet
 *
 * @returns Documento do pet atualizado
 *
 * @throws {Error} caso não haja usuário logado, ou o documento petID não exista
 */
export async function toggleInterestedInPet(
  petID: string,
  firebaseApp: FirebaseApp,
): Promise<Pet> {
  const db = getFirestore(firebaseApp)
  const petDocumentRef = doc(db, collectionPaths.pets, petID)
  const loggedInUserUID = getAuth(firebaseApp).currentUser?.uid

  if (!loggedInUserUID) {
    throw new Error("Cant toggle interest in pet: user is undefined.")
  }

  const pet = await getPetAction(petID, firebaseApp)
  if (!pet) throw new Error("The pet that uses this petID does not exist!")

  const interested = isInterestedInPet(pet.interestedUsersList, loggedInUserUID)
  let newInterestedList = []
  if (interested) {
    newInterestedList = await setUninterested(
      pet,
      petDocumentRef,
      loggedInUserUID,
    )
  } else {
    console.log("sending message")
    const message = await createInterestedPushMessage(
      loggedInUserUID,
      pet.owner_uid,
      petID,
      firebaseApp,
    )
    sendPushNotification(message)

    newInterestedList = await setInterested(
      pet,
      petDocumentRef,
      loggedInUserUID,
    )
  }

  pet.interestedUsersList = newInterestedList
  return pet
}
