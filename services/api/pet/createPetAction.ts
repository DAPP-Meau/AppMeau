import { getAuth } from "firebase/auth"
import { collection, doc, getFirestore, setDoc } from "firebase/firestore"
import { collectionPaths } from "@/constants"
import { submitDataToStorage } from "../storage/submitDataToStorage"
import { getStorage } from "firebase/storage"
import * as Crypto from "expo-crypto"
import { FirebaseApp } from "firebase/app"
import { PetRegistrationFields } from "@/components/organisms/CreatePetForm"
import { PetDocument } from "@/models"

/** Cria novo pet usando o usuário logado 
 *
 * @param fields Instância do formulário que criou os dados
 * @param firebaseApp Instẫncia do firebase a ser utilizada
 * 
 * @throws {Error} Se não tiver usuário logado
 */
export async function createPetAction(
  fields: PetRegistrationFields,
  firebaseApp: FirebaseApp,
): Promise<void> {
  const auth = getAuth(firebaseApp)
  const db = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)

  // Upando imagem para o Storage
  const { imageURI } = fields
  const image_url = await submitDataToStorage(
    imageURI,
    storage,
    "photo/pets/" + Crypto.randomUUID() + "_image_pet.jpeg",
  )
  if (!image_url) {
    throw new Error("image_url is empty, submitDataToStorage could have failed.")
  }

  // Upando dados no Firestore
  if (auth.currentUser === null) {
    throw new Error("No user logged in to create pet.")
  }
  const ref = collection(db, collectionPaths.pets)
  const data: PetDocument = {
    ...fields,
    owner_uid: auth.currentUser.uid,
    picture_url: image_url,
  }
  // TODO: setDoc pode nunca terminar. É necessário criar um timeout.
  await setDoc(doc(ref), data)
  // TODO: bloco try catch com erros que possam acontecer 
}
