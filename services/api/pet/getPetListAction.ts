import { collectionPaths } from "@/constants"
import { FirebaseApp } from "firebase/app"
import {
  QueryConstraint,
  collection,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore"

import getUserAction from "../user/getUserAction"
import {
  petDocumentSchema,
  PetDocument,
  UserRegistrationDocument,
} from "@/models"

export type PetAndOwnerDocument = {
  pet: { id: string; data: PetDocument }
  user: { id: string; data: UserRegistrationDocument }
}

export type GetPetListActionReturn = Array<PetAndOwnerDocument>

/** Buscar pets no banco de dados.
 *
 * @param firebaseApp Objeto de dados do firebase
 * @param QueryConstraint Lista de QueryConstraints do firebase como o `where`
 * ou `limit` a ser aplicados na pesquisa.
 * @returns uma Promise com uma lista de {@link PetAndOwnerDocument} dos dados.
 *
 * @example
 * const query = await getPetListAction(firebaseApp, where("animal.age", "==", "adult"), limit(100))
 */
export async function getPetListAction(
  firebaseApp: FirebaseApp,
  ...queryConstraints: QueryConstraint[]
): Promise<GetPetListActionReturn> {
  const petList: GetPetListActionReturn = []
  const db = getFirestore(firebaseApp)
  const petCollectionReference = collection(db, collectionPaths.pets)
  const q = query(petCollectionReference, ...queryConstraints)
  const querySnapshot = await getDocs(q)

  for (const document of querySnapshot.docs) {
    const petDocument: PetDocument = petDocumentSchema.parse(document.data())

    // Encontrar dono do pet
    const userId = petDocument.owner_uid
    const userData = await getUserAction(userId, firebaseApp)
    if (!userData) {
      // Avisar apenas na primeira vez
      console.warn("Existe um pet sem dono!")
      continue
    }

    petList.push({
      pet: { id: document.id, data: petDocument },
      user: { id: userId, data: userData },
    })
  }

  return petList
}
