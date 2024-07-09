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
      throw new Error("No user logged in to create pet.");
    }
    
    const ref = collection(db, collections.pets)

    fields.animal.picture_uid = ""
    fields.animal.owner_uid = auth.currentUser.uid
    const data : PetRegistrationDocument = fields

    await setDoc(doc(ref), data)

    alert("Seu pet foi registrado para adoção com sucesso.")
    form.reset()
    // TODO: Navegar para tela de sucesso.
  } catch (error) {
    // TODO: tratar erros que possam ocorrer aqui.
    alert(error)
    throw(error)
  }
}
