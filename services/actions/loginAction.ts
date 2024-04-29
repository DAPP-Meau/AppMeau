import { Auth, signInWithEmailAndPassword } from "firebase/auth";

export const loginAction = (auth: Auth, username: string, password: string) => {
  signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      alert("Bem vindo!");
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      alert(error);
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};
