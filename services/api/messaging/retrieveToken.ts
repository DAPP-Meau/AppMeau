import { collectionPaths } from "@/constants"
import { DeviceToken, deviceTokenSchema } from "@/models/FcmToken"
import { FirebaseApp } from "firebase/app"
import { doc, getDoc, getFirestore } from "firebase/firestore"

/**
 * Retorna o token do usuário
 *
 * @param userID id do usuário
 * @param firebaseApp instância do firebase
 * @returns O token do usuário, ou undefined caso não exista
 */
export async function retrieveToken(
  userID: string,
  firebaseApp: FirebaseApp,
): Promise<DeviceToken | undefined> {
  const db = getFirestore(firebaseApp)
  const docRef = doc(db, collectionPaths.fcmTokens, userID)
  const deviceToken = await getDoc(docRef)

  const devTokenData = deviceToken.data()
  if (!devTokenData) return undefined
  // Converter data do firebase para Date
  const returnData: DeviceToken = {
    token: devTokenData.token,
    timestamp: devTokenData.timestamp.toDate(),
  }
  return deviceTokenSchema.parse(returnData)
}
