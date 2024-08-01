import { collections } from "@/constants"
import { FirebaseApp } from "firebase/app"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { PetRegistrationDocument } from "../models"

export default async function getPetAction(
  petId: string,
  firebaseApp: FirebaseApp,
): Promise<PetRegistrationDocument | undefined> {
  const db = getFirestore(firebaseApp)
  const petsRef = doc(db, collections.pets, petId)
  const pet = await getDoc(petsRef)
  const data = <PetRegistrationDocument>pet.data()
  // TODO: assertar tipo correto
  if (data) {
    return data as PetRegistrationDocument
  } else {
    return undefined
  }
}
