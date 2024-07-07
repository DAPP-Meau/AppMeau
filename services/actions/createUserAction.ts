import {
  Auth,
  AuthErrorCodes,
  UserCredential,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  UserRegistrationDocument,
  UserRegistrationForm,
} from "@/services/models";
import { Firestore, collection, doc, setDoc } from "firebase/firestore";
import { router } from "expo-router";
import { UseFormReturn } from "react-hook-form";
import { PasswordConfirm } from "@/components/completedForms/CreateUserForm";
import { collections } from "@/constants";

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
  auth: Auth,
  db: Firestore
): Promise<void> {
  try {
    // Desestruturando somente variáveis úteis para esta função
    const {
      login: { email, password, username },
      person: { fullName },
    } = fields;

    // TODO: descobrir o que acontece quando createUserWithEmailAndPassword está
    // sem conexão.
    const data: UserCredential = await createUserWithEmailAndPassword(
      auth, 
      email,
      password
    );

    const uid = data.user.uid;
    const ref = collection(db, collections.users);

    // Criando o objeto a ser inserido no banco utilizando o tipo correto.
    const registrationDocument: UserRegistrationDocument = {
      address: fields.address,
      person: fields.person,
      login: {
        email: email,
        username: username,
      },
    };
    // TODO: setDoc não resolve enquanto está sem internet. Como resolver
    // esse problema?
    setDoc(doc(ref, uid), registrationDocument),

    alert(
      fullName +
        ", Seu usuário: " +
        email +
        " foi criado com sucesso. Faça o login!"
    );
    form.reset();
    router.navigate("/(tabs)/login");
  } catch (error: any) {
    if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
      alert("Esse endereço de email já esta em uso!");
      form.setError("login.email", {
        type: "custom",
        message: "Este e-mail já está em uso.",
      });
      form.setFocus("login.email");
    } else if (error.code === AuthErrorCodes.INVALID_EMAIL) {
      alert("Esse endereço de e-mail é inválido!");
      form.setError("login.email", {
        type: "custom",
        message: "Este email é inválido.",
      });
      form.setFocus("login.email");
    } else {
      throw error
    }
  }
}
