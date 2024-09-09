import { collectionPaths } from "@/constants"
import { FirebaseApp } from "firebase/app"
import { deleteDoc, doc, getFirestore } from "firebase/firestore"

/**
 * Deleta o documento da sala através de seu ID.
 *
 * @param chatID id da sala a ser deletada
 * @param firebaseApp instância do firebase
 */
export default async function deleteRoomById(
  chatID: string,
  firebaseApp: FirebaseApp,
): Promise<void> {
  const db = getFirestore(firebaseApp)
  const roomReference = doc(db, collectionPaths.rooms, chatID)
  await deleteDoc(roomReference)
}
