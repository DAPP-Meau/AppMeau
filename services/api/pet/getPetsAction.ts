import { collectionPaths } from "@/constants"
import { Pet, petSchema, Snapshot } from "@/models"
import { FirebaseApp } from "firebase/app"
import {
  collection,
  getDocs,
  getFirestore,
  query,
  QueryConstraint,
} from "firebase/firestore"

/** Buscar lista de pets no banco de dados.
 *
 * @param firebaseApp Objeto de dados do firebase
 * @param QueryConstraint Lista opcional de QueryConstraints do firebase como o
 * `where` ou `limit` a ser aplicados na pesquisa.
 * @returns uma Promise com uma lista de `PetDocument`.
 *
 * @example
 * const query = await getPetsAction(
 *   firebaseApp,
 *   where("animal.age", "==", "adult"),
 *   limit(100)
 * )
 */
export async function getPetsAction(
  firebaseApp: FirebaseApp,
  ...queryConstraints: QueryConstraint[]
): Promise<Snapshot<Pet>[]> {
  const petList: Snapshot<Pet>[] = []
  const db = getFirestore(firebaseApp)
  const petCollectionReference = collection(db, collectionPaths.pets)
  const q = query(petCollectionReference, ...queryConstraints)
  const querySnapshot = await getDocs(q)

  for (const document of querySnapshot.docs) {
    const petDocument: Pet = petSchema.parse(document.data())
    petList.push({ id: document.id, data: petDocument })
  }

  return petList
}
