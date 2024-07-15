import {
  FirebaseStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage"

export async function submitDataToStorage(
  file_URL: string,
  storage: FirebaseStorage,
) {
  const httpsRef = ref(storage, file_URL)
  await getDownloadURL(httpsRef)
  
}
