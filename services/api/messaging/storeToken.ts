import { collectionPaths } from "@/constants"
import { DeviceToken } from "@/models/FcmToken"
import getCurrentUserUID from "@/utils/getCurrentUser"
import { FirebaseApp } from "firebase/app"
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore"

export default async function storeToken(
  token: string,
  firebaseApp: FirebaseApp,
): Promise<void> {
  /* timestamp dá erro de tipo aqui pois serverTimestamp() retorna um objeto 
   * cuja data só resolve quando o objeto é armazenado no servidor.
   */
  const data: DeviceToken = { token: token, timestamp: serverTimestamp() }

  const db = getFirestore(firebaseApp)
  const userID = getCurrentUserUID(firebaseApp)
  if (!userID) {
    throw new Error("No user logged in to store token for.")
  }

  await setDoc(doc(db, collectionPaths.fcmTokens, userID), data)
}
