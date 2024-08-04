import { collections } from "@/constants"
import { FirebaseApp } from "firebase/app"
import {
  QueryConstraint,
  collection,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore"
import {
  PetRegistrationDocument,
  UserRegistrationDocument,
  isPetRegistrationDocument,
} from "../models"
import getUserAction from "./getUserAction"

export type PetAndOwnerDocument = {
  pet: { id: string; data: PetRegistrationDocument }
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
  const petCollectionReference = collection(db, collections.pets)
  const q = query(petCollectionReference, ...queryConstraints)
  const querySnapshot = await getDocs(q)

  let skippedPets = 0
  let petSemDono = 0
  for (const result of querySnapshot.docs) {
    const petData = result.data()

    // Filtrar pets com tipo incorreto
    if (isPetRegistrationDocument(petData)) {
      // Encontrar dono do pet
      const userId = petData.animal.owner_uid
      const userData = await getUserAction(userId, firebaseApp)
      if (!userData) {
        // Avisar apenas na primeira vez
        if (!petSemDono) console.warn("Existe um pet sem dono!")
        skippedPets++
        petSemDono++
        continue
      }
      // TODO: filtrar users com o tipo errado
      petList.push({
        pet: { id: result.id, data: petData },
        user: { id: userId, data: userData },
      })
    } else {
      if (!skippedPets) {
        // Avisar apenas na primeira vez
        console.warn(
          "Existem pets no banco que não estão no formato de tipo correto!",
        )
      }
      skippedPets++
    }
  }
  if (skippedPets) console.warn(`${skippedPets} Pets ignorados.`)
  if (petSemDono) console.warn(`${petSemDono} Usuários ignorados.`)

  return petList
}
