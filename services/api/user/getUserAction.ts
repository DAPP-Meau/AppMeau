import { collectionPaths } from "@/constants"
import { FirebaseApp } from "firebase/app"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { UserDocument, userDocumentSchema } from "../../../models"
import { z } from "zod"

export default async function getUserAction(
  userId: string,
  firebaseApp: FirebaseApp,
): Promise<UserDocument | undefined> {
  const db = getFirestore(firebaseApp)
  const userRef = doc(db, collectionPaths.users, userId)
  const userDocumentSnapshot = await getDoc(userRef)
  const userDocument = userDocumentSnapshot.data()

  try {
    return userDocumentSchema.parse(userDocument)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log(e)
      return undefined
    }
  }
}
