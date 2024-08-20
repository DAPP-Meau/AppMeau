import { collectionPaths } from "@/constants"
import { Room, roomSchema, Snapshot } from "@/models"
import getCurrentUserUID from "@/utils/getCurrentUser"
import { FirebaseApp } from "firebase/app"
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore"

/** Retorna id da sala da conversa do usuário logado com o userID. Caso não
 * exista, ela é criadau
 *
 * @param userID Id do usuário que queira conversar
 * @param firebaseApp instância do firebase ativa
 * @returns Sala com ambos userID e o usuário logado.
 */
export default async function getRoomWithUserAction(
  userID: string,
  firebaseApp: FirebaseApp,
): Promise<Snapshot<Room>> {
  const db = getFirestore(firebaseApp)
  const roomCollectionReference = collection(db, collectionPaths.rooms)
  const loggedInUser = getCurrentUserUID(firebaseApp)
  if (!loggedInUser) throw new Error("No logged in user to create room!")

  const q = query(
    roomCollectionReference,
    where("users", "array-contains", loggedInUser),
  )
  const roomsSnapshot = await getDocs(q) // Encontrar Salas que tenham o usuário
  for (const roomS of roomsSnapshot.docs) {
    const room = roomSchema.parse(roomS.data())
    // Sala tem o usuário userID, retornar documento da sala.
    if (room.users.includes(userID)) return { id: roomS.id, data: room }
  }
  // Se a verificação acima falhar, criar nova sala.
  return await createRoom(firebaseApp, userID, loggedInUser)
}

async function createRoom(
  firebaseApp: FirebaseApp,
  user1: string,
  user2: string,
): Promise<{ id: string; data: Room }> {
  const db = getFirestore(firebaseApp)
  const documentReference = doc(collection(db, collectionPaths.rooms))
  const data: Room = { users: [user1, user2] }
  await setDoc(documentReference, data)
  return { id: documentReference.id, data: data }
}
