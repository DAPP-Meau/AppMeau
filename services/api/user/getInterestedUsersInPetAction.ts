import { FirebaseApp } from "firebase/app"
import getPetAction from "../pet/getPetAction"
import getUserAction, { GetUserActionReturn } from "./getUserAction"

/** Buscar lista de usuários interessados no pet
 *
 * @param petID Id do pet a ser buscado
 * @returns Lista de usuários interessados no pet. Se não tiver usuários a lista retorna vazia.
 *
 * @throws Se não tiver usuário logado
 */
export async function getInterestedUsersInPetAction(
  petID: string,
  firebaseApp: FirebaseApp,
): Promise<GetUserActionReturn[]> {
  const userList: GetUserActionReturn[] = []
  const petDocument = await getPetAction(petID, firebaseApp)
  console.log(petDocument)
  if (!petDocument || !petDocument.interestedUsersList) {
    return []
  }

  for (const userID of petDocument.interestedUsersList) {
    const userDocument = await getUserAction(userID, firebaseApp)
    userDocument && userList.push(userDocument)
  }

  return userList
}
