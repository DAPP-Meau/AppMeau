import { FirebaseApp } from "firebase/app"
import getPetAction from "./getPetAction"
import getUserAction from "../user/getUserAction"
import { PetAndOwnerDocument } from "@/models"

/**
 * Buscar pet no banco por ID do pet.
 *
 * @param petID id do pet a ser encontrado no banco de dados
 * @param firebaseApp Instância do firebase
 * @returns O documento do pet, undefined caso contrário.
 */
export default async function getPetAndOwnerAction(
  petID: string,
  firebaseApp: FirebaseApp,
): Promise<PetAndOwnerDocument | undefined> {
  const petDocument = await getPetAction(petID, firebaseApp)

  if (petDocument) {
    const { owner_uid } = petDocument
    const userDocument = await getUserAction(owner_uid, firebaseApp)
    if (userDocument) {
      return {
        pet: { id: petID, data: petDocument },
        user: { id: owner_uid, data: userDocument },
      }
    }
  }
  return undefined
}
