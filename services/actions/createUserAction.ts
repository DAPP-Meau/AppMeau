import {
  Auth,
  AuthErrorCodes,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth"
import {
  UserRegistrationDocument,
  UserRegistrationForm,
} from "@/services/models"
import { Firestore, collection, doc, getFirestore, setDoc } from "firebase/firestore"
import { router } from "expo-router"
import { UseFormReturn } from "react-hook-form"
import { PasswordConfirm } from "@/components/completedForms/CreateUserForm"
import { collections } from "@/constants"
import { submitDataToStorage } from "./submitImageToStorage"
import * as Crypto from "expo-crypto"
import { FirebaseStorage, getStorage } from "firebase/storage"
import { FirebaseApp } from "firebase/app"

/**
 * Registra novo usuário no firebase.
 * @param {UserRegistrationForm & PasswordConfirm} fields - O objeto contendo os
 * dados do usuário a ser registrado.
 * @param {UseFormReturn<UserRegistrationForm & PasswordConfirm>} form -
 * O formulário gerado pelo gancho useHook do react-hook-form.
 * @param {Auth} auth - A interface de serviço de autorização do firebase.
 * @param {Firestore} db - A interface de serviço do Firestore.
 */
export async function createUserAction(
  fields: UserRegistrationForm & PasswordConfirm,
  form: UseFormReturn<UserRegistrationForm & PasswordConfirm>,
  firebaseApp: FirebaseApp
): Promise<void> {
  const auth = getAuth(firebaseApp)
  const db = getFirestore(firebaseApp)
  const storage = getStorage(firebaseApp)

  try {
    // Desestruturando somente variáveis úteis para esta função
    const {
      login: { email, password, username },
      person: { fullName },
      imageURI,
    } = fields

    if (!imageURI) {
      throw new Error("imageURI is empty.")
    }


    // Upando imagem para o Storage
    const image_url = await submitDataToStorage(
      imageURI,
      storage,
      "photo/users/" + Crypto.randomUUID() + "_image_user.jpeg",
    )
    if (!image_url) {
      throw new Error("image_url is empty.")
    }
    fields.person.picture_uid = image_url


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
    const ref = collection(db, collections.users)

    // Criando o objeto a ser inserido no banco utilizando o tipo correto.
    const registrationDocument: UserRegistrationDocument = {
      address: fields.address,
      person: fields.person,
      login: {
        email: email,
        username: username,
      },
    }

    // TODO: setDoc não resolve enquanto está sem internet.
    await setDoc(doc(ref, uid), registrationDocument)


    //Sucesso! Usuário criado no Firestore
    alert(
      fullName +
        ", Seu usuário: " +
        email +
        " foi criado com sucesso. Faça o login!",
    )

    form.reset()
    router.navigate("/login")
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
