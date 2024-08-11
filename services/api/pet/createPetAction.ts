import { getAuth } from "firebase/auth"
import {
  PetRegistrationDocument,
  PetRegistrationFields,
} from "@/models"
import { collection, doc, getFirestore, setDoc } from "firebase/firestore"
import { UseFormReturn } from "react-hook-form"
import { collections } from "@/constants"
import { submitDataToStorage } from "../storage/submitDataToStorage"
import { getStorage } from "firebase/storage"
import * as Crypto from "expo-crypto"
import { FirebaseApp } from "firebase/app"

export async function createPetAction(
  fields: PetRegistrationFields,
  form: UseFormReturn<PetRegistrationFields>,
  firebaseApp: FirebaseApp,
  navigation: any
): Promise<void> {

  const auth = getAuth(firebaseApp)
  const db = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)
  
  try {
    // Upando imagem para o Storage
    const {imageURI} = fields
    if (!imageURI) {
      throw new Error("imageURI is empty.")
    }
    const url_image = await submitDataToStorage(
      imageURI,
      storage,
      "photo/pets/" + Crypto.randomUUID() + "_image_pet.jpeg",
    )
    if (!url_image) {
      throw new Error("image_url is empty.")
    }
    if (auth.currentUser === null) {
      throw new Error("No user logged in to create pet.");
    }
    fields.animal.owner_uid = auth.currentUser.uid
    fields.animal.picture_uid = url_image

    // Upando dados no Firestore
    const ref = collection(db, collections.pets)
    const data: PetRegistrationDocument = {
      animal: fields.animal,
      temperament: fields.temperament,
      health: fields.health,
      adoptionRequirements: fields.adoptionRequirements
    }
    await setDoc(doc(ref), data)

    navigation.navigate("petRegistrationSuccess")
    form.reset()
  } catch (error) {
    // TODO: tratar erros que possam ocorrer aqui.
    alert(error)
    throw (error)
  }
}

