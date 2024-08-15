import { FirebaseApp } from "firebase/app"
import { QueryConstraint } from "firebase/firestore"

import getUserAction from "../user/getUserAction"
import { getPetsAction } from "./getPetsAction"
import { PetAndOwnerDocument } from "@/models"

/** Buscar pets no banco de dados e unir com os respectivos donos para
 * renderizar listas de cartões de pets.
 *
 * @param firebaseApp Objeto de dados do firebase
 * @param QueryConstraint Lista opcional de QueryConstraints do firebase como o
 * `where` ou `limit` a ser aplicados na pesquisa.
 * @returns uma Promise com uma lista de {@link PetAndOwnerDocument} dos dados.
 *
 * @example
 * const query = await getPetListAction(
 *   firebaseApp,
 *   where("animal.age", "==", "adult"),
 *   limit(100)
 * )
 */
export async function getPetListAction(
  firebaseApp: FirebaseApp,
  ...queryConstraints: QueryConstraint[]
): Promise<PetAndOwnerDocument[]> {
  const petList = await getPetsAction(firebaseApp, ...queryConstraints)

  const petAndOwner: PetAndOwnerDocument[] = []
  for (const petDocument of petList) {
    // Encontrar dono do pet
    const userId = petDocument.data.owner_uid
    const userDocument = await getUserAction(userId, firebaseApp)
    if (!userDocument) {
      console.warn(
        "Erro ao pegar dono de um pet, ignorando pets %s",
        petDocument.id,
      )
      continue
    }

    petAndOwner.push({
      pet: { ...petDocument },
      user: { id: userId, data: userDocument },
    })
  }

  return petAndOwner
}
