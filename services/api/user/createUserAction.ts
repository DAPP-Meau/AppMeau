import {
  AuthErrorCodes,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth"
import { UserDocument, userDocumentSchema } from "@/models"
import { collection, doc, getFirestore, setDoc } from "firebase/firestore"
import { UseFormReturn } from "react-hook-form"
import { UserRegistrationFields } from "@/components/organisms/CreateUserForm"
import { collectionPaths } from "@/constants"
import { submitDataToStorage } from "../storage/submitDataToStorage"
import * as Crypto from "expo-crypto"
import { getStorage } from "firebase/storage"
import { FirebaseApp, FirebaseError } from "firebase/app"

/**
 * Registra novo usuário no firebase.
 *
 * @param form Instância do formulário que gerou os dados
 * @param firebaseApp Instância do app do firebase ativa
 */
export async function createUserAction(
  form: UseFormReturn<UserRegistrationFields>,
  firebaseApp: FirebaseApp,
): Promise<void> {
  const auth = getAuth(firebaseApp)
  const db = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)

  try {
    const fields = form.getValues()

    // Desestruturando somente variáveis úteis para esta função
    const {
      login: { email, username },
      imageURI,
      password,
    } = fields

    // Upando imagem para o Storage
    const image_url = await submitDataToStorage(
      imageURI,
      storage,
      "photo/users/" + Crypto.randomUUID() + "_image_user.jpeg",
    )
    if (!image_url) {
      throw new Error("image_url is empty.")
    }

    // Criando usuário no Firebase Auth
    // TODO: descobrir o que acontece quando createUserWithEmailAndPassword está
    // sem conexão.
    const data: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )

    //Setando documento de usuário no Firestore
    const uid = data.user.uid
    const ref = collection(db, collectionPaths.users)

    fields.person.age = Number(fields.person.age)

    // Criando o objeto a ser inserido no banco utilizando o tipo correto.
    const registrationDocument: UserDocument = userDocumentSchema.parse({
      person: { ...fields.person, pictureURL: image_url },
      address: fields.address,
      login: {
        email: email,
        username: username,
      },
    })

    // TODO: setDoc não resolve enquanto está sem internet.
    await setDoc(doc(ref, uid), registrationDocument)
    //Sucesso! Usuário criado no Firestore
  } catch (error: any) {
    // TODO: tratar outros erros que possam ocorrer.
    if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
      alert("Esse endereço de email já esta em uso!")
      form.setError("login.email", {
        type: "custom",
        message: "Este e-mail já está em uso.",
      })
      form.setFocus("login.email")
    } else if (error.code === AuthErrorCodes.INVALID_EMAIL) {
      alert("Esse endereço de e-mail é inválido!")
      form.setError("login.email", {
        type: "custom",
        message: "Este email é inválido.",
      })
      form.setFocus("login.email")
    } else {
      throw error
    }
  }
}
