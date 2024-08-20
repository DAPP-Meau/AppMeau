import { FirebaseApp } from "firebase/app"
import { getAuth } from "firebase/auth"

export default function getCurrentUserUID(firebaseApp: FirebaseApp) : string | undefined {
  return getAuth(firebaseApp).currentUser?.uid
}