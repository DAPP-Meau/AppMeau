import { FirebaseApp } from "firebase/app"
import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore"
import { PetRegistrationDocument } from "@/models"
import { getAuth } from "firebase/auth"
import { collections } from "@/constants"

/**
 * 
 * @param firebaseApp Objeto do firebase 
 * @param pet Documento do pet a ser favoritado/desfavoritado
 * @param petID Id do pet
 * @param onValueChange Callback de quando o valor for modificado. 
 */
export async function HandleFavourite(
  firebaseApp: FirebaseApp,
  pet: PetRegistrationDocument,
  petID: string,
  onValueChange: (value: boolean) => void
): Promise<void> {
  const db = getFirestore(firebaseApp)
  const petDocumentRef = doc(db, collections.pets, petID)
  const loggedInUserUID = getAuth(firebaseApp).currentUser?.uid

  if (loggedInUserUID) {
    const isInterested = pet.interested.includes(loggedInUserUID)
    onValueChange(isInterested)
    if (isInterested) {
      await updateDoc(petDocumentRef, {
        interested: arrayRemove(loggedInUserUID),
      })
    } else {
      await updateDoc(petDocumentRef, {
        interested: arrayUnion(loggedInUserUID),
      })
    }
  }
}
