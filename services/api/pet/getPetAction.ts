import { collectionPaths } from "@/constants"
import { PetDocument, petDocumentSchema } from "@/models"
import { FirebaseApp } from "firebase/app"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { z } from "zod"

/**
 * Buscar pet no banco por ID do pet.
 *
 * @param petId id do pet a ser encontrado no banco de dados
 * @param firebaseApp Instância do firebase
 * @returns O documento do pet, undefined caso contrário.
 */
export default async function getPetAction(
  petId: string,
  firebaseApp: FirebaseApp,
): Promise<PetDocument | undefined> {
  const db = getFirestore(firebaseApp)
  const petsRef = doc(db, collectionPaths.pets, petId)
  const documentSnapshot = await getDoc(petsRef)
  const petData = documentSnapshot.data()

  try {
    return petDocumentSchema.parse(petData)
  } catch (e) {
    if (e instanceof z.ZodError) {
      return undefined
    }
  }
}
