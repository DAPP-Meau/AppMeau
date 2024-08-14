import { collectionPaths } from "@/constants"
import { RoomDocument, roomDocumentSchema } from "@/models"
import getCurrentUserUID from "@/utils/getCurrentUser"
import { FirebaseApp } from "firebase/app"
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore"

export type GetUserRoomsActionData = { id: string; data: RoomDocument }
export type GetUserRoomsActionReturn = GetUserRoomsActionData[]

/**
 * Pegar lista de salas abertas do usuário logadp
 *
 * @param firebaseApp instância do firebase
 * @returns Lista de salas
 */
export default async function getUserRoomsAction(
  firebaseApp: FirebaseApp,
): Promise<GetUserRoomsActionReturn> {
  const db = getFirestore(firebaseApp)
  const roomCollectionReference = collection(db, collectionPaths.rooms)
  const userUID = getCurrentUserUID(firebaseApp)

  const roomQuery = query(
    roomCollectionReference,
    where("users", "array-contains", userUID),
  )
  const roomQuerySnapshot = await getDocs(roomQuery)

  const roomList: GetUserRoomsActionReturn = []
  for (const room of roomQuerySnapshot.docs) {
    const roomDocument: RoomDocument = roomDocumentSchema.parse(room.data())
    roomList.push({ id: room.id, data: roomDocument })
  }

  return roomList
}
