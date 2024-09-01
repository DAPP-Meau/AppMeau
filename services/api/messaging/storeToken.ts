import { collectionPaths } from "@/constants"
import { DeviceToken } from "@/models/FcmToken"
import getCurrentUserUID from "@/utils/getCurrentUser"
import { FirebaseApp } from "firebase/app"
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore"

/**
 * Armazena o token do usuário logado junto com a data em que o token foi
 * armazenado na coleção de tokens.
 *
 * @param token token a ser armazenado
 * @param firebaseApp instância do firebase
 * @param uid usuário a ter o token armazenado. É opcional: o padrão é armazenar
 * para o usuário logado
 * 
 * @throws Error caso não tenha usuário logado
 */
export default async function storeToken(
  token: string,
  firebaseApp: FirebaseApp,
  uid?: string
): Promise<void> {
  /* timestamp dá erro de tipo aqui pois serverTimestamp() retorna um objeto 
   * cuja data só resolve quando é armazenado no servidor.
   */
  const data: DeviceToken = { token: token, timestamp: serverTimestamp() }

  const db = getFirestore(firebaseApp)
  const userID = uid ? uid : getCurrentUserUID(firebaseApp)
  if (!userID) {
    throw new Error("No user logged in to store token for.")
  }

  const docRef = doc(db, collectionPaths.fcmTokens, userID)
  await setDoc(docRef, data)
}
