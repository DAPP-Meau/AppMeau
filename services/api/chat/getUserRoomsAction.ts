import { collectionPaths } from "@/constants"
import { Room, roomSchema, User } from "@/models"
import getCurrentUserUID from "@/utils/getCurrentUser"
import { FirebaseApp } from "firebase/app"
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore"
import getUserAction from "../user/getUserAction"

export type GetUserRoomsActionData = {
  room: { id: string; data: Room }
  user: { id: string; data: User }
}
export type GetUserRoomsActionReturn = GetUserRoomsActionData[]

/**
 * Retorna uma lista de salas de chat do usuário
 *
 * @param firebaseApp instância do firebase
 * @returns Lista de salas
 */
export default async function getUserRoomsAction(
  firebaseApp: FirebaseApp,
): Promise<GetUserRoomsActionReturn> {
  const db = getFirestore(firebaseApp)
  const roomCollectionReference = collection(db, collectionPaths.rooms)
  const loggedInUserID = getCurrentUserUID(firebaseApp)

  const roomQuery = query(
    roomCollectionReference,
    where("users", "array-contains", loggedInUserID),
  )
  const roomQuerySnapshot = await getDocs(roomQuery)

  const roomList: GetUserRoomsActionReturn = []
  for (const room of roomQuerySnapshot.docs) {
    const roomDocument: Room = roomSchema.parse(room.data())
    const userID = roomDocument.users
      .filter((val) => {
        return val !== loggedInUserID
      })
      .at(0)
    if (!userID) {
      console.error("Error in getUserRoomsAction")
      continue
    }

    const userDocument = await getUserAction(userID, firebaseApp)
    if (!userDocument) {
      console.error(
        "Error in getUserRoomsAction, there is no user with id" + userID,
      )
      continue
    }
    roomList.push({
      room: { id: room.id, data: roomDocument },
      user: userDocument,
    })
  }

  return roomList
}
