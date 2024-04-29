import { Auth, signInWithEmailAndPassword } from 'firebase/auth'

export type LoginFormData = {
  username: string
  password: string
}

export const loginAction = (
  auth: Auth,
  { username, password }: LoginFormData,
) => {
  signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      alert('Bem vindo!')
      const user = userCredential.user
      // ...
    })
    .catch((error) => {
      alert(error)
      const errorCode = error.code
      const errorMessage = error.message
    })
}
