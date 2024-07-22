import { PetRegistrationDocument, isPetRegistrationDocument } from "../models"
import { FirebaseApp } from "firebase/app"
import { QueryConstraint, collection, getDocs, getFirestore, limit, query } from "firebase/firestore"

export async function getPetListAction(
  firebaseApp: FirebaseApp,
  filter: QueryConstraint[] = [limit(100)],
): Promise<Array<PetRegistrationDocument>> {
  const list: Array<PetRegistrationDocument> = []
  const db = getFirestore(firebaseApp)
  const petColectionReference = collection(db, "pets")
  const q = query(petColectionReference, ...filter)
  const querySnapshot = await getDocs(q)

  let skippedPets = 0
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    if (isPetRegistrationDocument(data)) {
      list.push(data)
    } else {
      if (!skippedPets) {
        console.warn(
          "Existem pets no banco que não estão no formato de tipo correto!",
        )
      }
      skippedPets++
    }
  })
  if (skippedPets) console.warn(skippedPets + " Pets ignorados." )

  return list
}
