import { PetAndOwnerDocument } from "@/models"
import { FirebaseApp } from "firebase/app"
import getPetAction from "./getPetAction"
import getUserAction from "../user/getUserAction"

/**
 * Buscar pet no banco por ID do pet.
 *
 * @param petId id do pet a ser encontrado no banco de dados
 * @param firebaseApp Instância do firebase
 * @returns O documento do pet, undefined caso contrário.
 */
export default async function getPetAndOwnerAction(
  petId: string,
  firebaseApp: FirebaseApp,
): Promise<PetAndOwnerDocument | undefined> {
  const petDocument = await getPetAction(petId, firebaseApp)
  if (petDocument) {
    const userDocument = await getUserAction(petDocument.owner_uid, firebaseApp)
    if (userDocument) {
      return {
        pet: { id: petId, data: petDocument },
        user: { ...userDocument },
      }
    }
  }
  return undefined
}
