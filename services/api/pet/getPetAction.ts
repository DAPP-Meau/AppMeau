import { collectionPaths } from "@/constants"
import { Pet, petSchema } from "@/models"
import { FirebaseApp } from "firebase/app"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { z } from "zod"

/**
 * Buscar pet no banco por ID do pet.
 *
 * @param petID id do pet a ser encontrado no banco de dados
 * @param firebaseApp Instância do firebase
 * @returns O documento do pet, undefined caso contrário.
 */
export default async function getPetAction(
  petID: string,
  firebaseApp: FirebaseApp,
): Promise<Pet | undefined> {
  const db = getFirestore(firebaseApp)
  const petsRef = doc(db, collectionPaths.pets, petID)
  const documentSnapshot = await getDoc(petsRef)
  const petData = documentSnapshot.data()

  try {
    return petSchema.parse(petData)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error("Schema error in getPetAction: " + e)
      return undefined
    }
  }
}
