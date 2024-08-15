import { collectionPaths } from "@/constants"
import getCurrentUserUID from "@/utils/getCurrentUser"
import { FirebaseApp } from "firebase/app"
import {
  collection, getDocs,
  getFirestore,
  query, where
} from "firebase/firestore"

export default async function checkRoomWithUserExists(
  userID: string,
  firebaseApp: FirebaseApp,
) {
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
  return roomsSnapshot.empty
}
