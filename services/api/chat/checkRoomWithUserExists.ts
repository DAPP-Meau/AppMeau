import { collectionPaths } from "@/constants"
import { roomSchema } from "@/models"
import getCurrentUserUID from "@/utils/getCurrentUser"
import { FirebaseApp } from "firebase/app"
import {
  collection, getDocs,
  getFirestore,
  query,
  where
} from "firebase/firestore"

/**
 * Descobrir se o usuário logado tem sala de chat com outro usuário sobre algum
 * pet dele.
 * 
 * @param userID id do usuário o qual queira verificar
 * @param petID id do pet o qual queira verificar
 * @param firebaseApp A instância do firebase atual
 * @returns Se existe uma sala em que o usuário logado esteja conversando com
 * o outro sobre o pet
 */
export default async function checkRoomWithUserExists(
  userID: string,
  petID: string,
  firebaseApp: FirebaseApp,
) {
  const db = getFirestore(firebaseApp)
  const roomCollectionReference = collection(db, collectionPaths.rooms)
  const loggedInUser = getCurrentUserUID(firebaseApp)
  if (!loggedInUser) throw new Error("No logged in user to create room!")

  const q1 = query( // Todas as salas de chat do usuário logado
    roomCollectionReference,
    where("users", "array-contains", loggedInUser),
    where("petID", "==", petID)
  )
  const roomsSnapshot = await getDocs(q1) 
  for (const room of roomsSnapshot.docs) {
    // Encontrar a que tem o usuário do parâmetro userID
    if (roomSchema.parse(room.data()).users.includes(userID)) return true
  }

  return false
}
