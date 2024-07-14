import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage"

export async function submitDataToStorage(
  file_URI: string,
  storage: FirebaseStorage,
  nameImage: string,
) {
  const storageRef = ref(storage, nameImage)
  const file = await fetch(file_URI)
  const file_blob = await file.blob()
  const snapshot = await uploadBytesResumable(storageRef, file_blob)
  const url = await getDownloadURL(snapshot.ref)
  return url
}
