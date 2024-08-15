import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage"

/**
 * Armazena arquivo no Firebase Storage
 *
 * @param fileURI URI do arquivo a ser armazenado
 * @param storage instância do firebaseStorage
 * @param fileName Nome do arquivo no banco
 * @returns url do arquivo armazenado
 */
export async function submitDataToStorage(
  fileURI: string,
  storage: FirebaseStorage,
  fileName: string,
) {
  const storageRef = ref(storage, fileName)
  const file = await fetch(fileURI)
  const file_blob = await file.blob()
  const snapshot = await uploadBytesResumable(storageRef, file_blob)
  const url = await getDownloadURL(snapshot.ref)
  return url
}
