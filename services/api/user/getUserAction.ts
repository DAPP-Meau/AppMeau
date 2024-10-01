import { collectionPaths } from "@/constants"
import { FirebaseApp } from "firebase/app"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { Snapshot, User, userSchema } from "../../../models"
import { z } from "zod"

/**
 * Buscar usuário pelo seu ID
 *
 * @param userID Usuário a ser encontrado
 * @param firebaseApp Instância do firebase
 * @returns Documento do usuário, ou undefined caso não exista.
 */
export default async function getUserAction(
  userID: string,
  firebaseApp: FirebaseApp,
): Promise<User | undefined> {
  const db = getFirestore(firebaseApp)
  const userRef = doc(db, collectionPaths.users, userID)
  const userDocumentSnapshot = await getDoc(userRef)
  const userDocument = userDocumentSnapshot.data()

  try {
    return userSchema.parse(userDocument)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.warn(e)
      return undefined
    }
  }
}

export async function getUserActionWId(
  userID: string,
  firebaseApp: FirebaseApp,
): Promise<Snapshot<User> | undefined> {
  const db = getFirestore(firebaseApp)
  const userRef = doc(db, collectionPaths.users, userID)
  const userDocumentSnapshot = await getDoc(userRef)
  const userDocument = userDocumentSnapshot.data()

  try {
    return { id: userID, data: userSchema.parse(userDocument) }
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.warn(e)
      return undefined
    }
  }
}
