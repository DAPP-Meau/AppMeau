import { FirebaseApp } from "firebase/app"
import getPetAction from "../pet/getPetAction"
import getUserAction from "./getUserAction"
import { Snapshot, User } from "@/models"

/** Buscar lista de usuários interessados no pet
 *
 * @param petID Id do pet a ser buscado
 * @returns Lista de usuários interessados no pet. Se não houver usuários a
 * lista retorna vazia.
 */
export async function getInterestedUsersInPetAction(
  petID: string,
  firebaseApp: FirebaseApp,
): Promise<Snapshot<User>[]> {
  const userList: Snapshot<User>[] = []
  const petDocument = await getPetAction(petID, firebaseApp)
  if (!petDocument?.interestedUsersList) {
    return []
  }

  for (const userID of petDocument.interestedUsersList) {
    const userDocument = await getUserAction(userID, firebaseApp)
    if (userDocument) userList.push({ id: userID, data: userDocument })
  }

  return userList
}
