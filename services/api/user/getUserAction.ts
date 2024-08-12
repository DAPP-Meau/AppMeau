import { collectionPaths } from "@/constants"
import { FirebaseApp } from "firebase/app"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { UserDocument } from "../../../models"

export default async function getUserAction(
  userId: string,
  firebaseApp: FirebaseApp,
): Promise<UserDocument | undefined> {
  try {
    const db = getFirestore(firebaseApp)
    const userRef = doc(db, collectionPaths.users, userId)
    const userDoc = await getDoc(userRef)
    const data = userDoc.data()
    // TODO: assertar tipo correto de data.
    if (data) return data as UserDocument
    else return undefined
  } catch (error) {
    console.error("Erro em getUserAction(" + userId + "): " + error)
    throw error
  }
}
