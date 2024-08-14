import { collectionPaths } from "@/constants"
import { RoomDocument, roomDocumentSchema } from "@/models"
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

/** Retorna id da sala da conversa do usuário logado com o userID. Caso não exista, ela é criada.
 *
 * @param userID Id de usuário */
export default async function getRoomWithUserAction(
  firebaseApp: FirebaseApp,
  userID: string,
): Promise<{ id: string; data: RoomDocument }> {
  const db = getFirestore(firebaseApp)
  const roomCollectionReference = collection(db, collectionPaths.rooms)
  const loggedInUser = getCurrentUserUID(firebaseApp)
  if (!loggedInUser) throw new Error("No logged in user to create room!")

  const q = query(
    roomCollectionReference,
    where("users", "array-contains", userID),
    where("users", "array-contains", loggedInUser),
  )
  const roomsSnapshot = await getDocs(q)
  if (roomsSnapshot.empty)
    return await createRoom(firebaseApp, userID, loggedInUser)

  const roomsDocuments = roomsSnapshot.docs
  if (roomsDocuments.length > 1) {
    console.warn("There are multiple rooms of the logged in user with" + userID)
  }
  const room = roomsDocuments.at(0)
  if (!room?.exists) return await createRoom(firebaseApp, userID, loggedInUser)
  return { id: room.id, data: roomDocumentSchema.parse(room.data) }
}

async function createRoom(
  firebaseApp: FirebaseApp,
  user1: string,
  user2: string,
): Promise<{ id: string; data: RoomDocument }> {
  const db = getFirestore(firebaseApp)
  const documentReference = doc(collection(db, collectionPaths.rooms))
  const data: RoomDocument = { users: [user1, user2] }
  await setDoc(documentReference, data)
  return { id: documentReference.id, data: data }
}
