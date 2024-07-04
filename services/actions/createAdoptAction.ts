import { Auth } from "firebase/auth"
import {
  AdoptionRegistrationForm,
  AdoptionStorageDocument,
} from "@/services/models"
import {
  Firestore,
  collection,
  doc,
  setDoc,
  FirestoreErrorCode,
} from "firebase/firestore"
import { UseFormReturn } from "react-hook-form"
import { collections } from "@/constants"

export async function createAdoptAction(
  fields: AdoptionRegistrationForm,
  form: UseFormReturn<AdoptionRegistrationForm, any, undefined>,
  db: Firestore,
  auth: Auth,
) {
  try {
    if (auth.currentUser === null) {
      throw "user not logged in"
    }
    const data: AdoptionStorageDocument = {
      ...fields,
      createdBy: auth.currentUser.uid,
    }

    const ref = collection(db, collections.pets)

    // SetDoc nunca resolve caso esteja sem conexão.
    // Portanto é adicionado um timeout de 10 segundos.
    await Promise.race([timeout(10000), setDoc(doc(ref), data)])
    alert("Seu pet foi registrado para adoção com sucesso.")
    form.reset()
    // TODO: Navegar para tela de sucesso.
  } catch (error: any) {
    if (error === timeoutError) {
      alert(
        "Está levando muito tempo para adicionar o animal. Verifique sua conexão com a internet",
      )
    } else if ((error as FirestoreErrorCode) === "unauthenticated") {
      // TODO: erros do firestore
    } else {
      console.log(error)
    }
  }
}

const timeoutError = "setdoc/timeout"

function timeout(ms: number) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(() => new Error(timeoutError)), ms)
  })
}
