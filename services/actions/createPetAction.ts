import { Auth } from "firebase/auth"
import {
  PetRegistrationDocument,
  PetRegistrationFields,
} from "@/services/models"
import { Firestore, collection, doc, setDoc } from "firebase/firestore"
import { UseFormReturn } from "react-hook-form"
import { collections } from "@/constants"

export async function createPetAction(
  fields: PetRegistrationFields,
  form: UseFormReturn<PetRegistrationFields>,
  db: Firestore,
  auth: Auth,
) : Promise<void> {
  try {
    if (auth.currentUser === null) {
      return 
    }
    
    const ref = collection(db, collections.pets)

    const data: PetRegistrationDocument = {
      ...fields,
      owner_uid: auth.currentUser.uid,
      picture_uid: "null",
    }

    await setDoc(doc(ref), data)

    alert("Seu pet foi registrado para adoção com sucesso.")
    form.reset()
    // TODO: Navegar para tela de sucesso.
  } catch (error) {
    console.log(error)
  }
}
