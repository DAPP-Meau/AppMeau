import { Auth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  UserRegistrationDocument,
  UserRegistrationForm,
} from "@/services/models";
import { Firestore, collection, doc, setDoc } from "firebase/firestore";
import { router } from "expo-router";

/**
 * Registra novo usuário no firebase.
 * @param {createUserAction} form - O objeto contendo os dados do usuário a
 * ser registrados
 * @param {Auth} auth - A interface de serviço de autorização do firebase.
 * @param {Firestore} db - A interface de serviço do Firestore.
 * @returns {Promise<Boolean>} Se o formulário deve ou não apagar todos os
 * campos.
 */
export const createUserAction = (
  form: UserRegistrationForm,
  auth: Auth,
  db: Firestore
): Promise<boolean> => {
  // Desestruturando somente variáveis úteis para esta função
  const {
    login: { email, password, username },
    person: { fullName },
  } = form;

  createUserWithEmailAndPassword(auth, email, password)
    .then((data) => {
      const uid = data.user.uid;
      const ref = collection(db, "users");

      // Criando objeto de criação de documento com o tipo correto.
      const registrationDocument: UserRegistrationDocument = {
        address: form.address,
        person: form.person,
        login: {
          email: email,
          username: username,
        },
      };

      setDoc(doc(ref, uid), registrationDocument);
      alert(
        fullName + ", Seu usuário: " + email + " foi criado com sucesso. Faça o login!"
      );
      router.navigate("/(tabs)/login");
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        alert("Esse endereço de email já esta em uso!");
      }

      if (error.code === "auth/invalid-email") {
        alert("Esse endereço de e-mail é inválido!");
      }
      alert(error);
      router.replace("/");
    });
  return new Promise((resolve) => {
    resolve(true);
  });
};
