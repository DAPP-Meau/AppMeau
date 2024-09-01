import React, { useContext } from "react"
import { AuthErrorCodes, getAuth } from "firebase/auth"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { loginAction } from "@/services/api/auth/loginAction"
import LoginForm, { LoginFields } from "@/components/organisms/LoginForm"
import { BlueColorScreen } from "@/components/atoms/ScreenColorScheme"
import { Alert } from "react-native"
import { UseFormReturn } from "react-hook-form"
import { FirebaseError } from "firebase/app"
import storeToken from "@/services/api/messaging/storeToken"
import { ExpoPushTokenContext } from "@/services/store/TokenContext"

export default function Login() {
  const firebaseapp = useContext(FirebaseAppContext)
  const pushToken = useContext(ExpoPushTokenContext)
  const auth = getAuth(firebaseapp)

  const submitCallback = async (form: UseFormReturn<LoginFields>) => {
    try {
      await loginAction(form, auth)
      await storeToken(pushToken, firebaseapp)
      form.reset()
      Alert.alert("Bem vindo!")
    } catch (error) {
      const setWrongPassword = () =>
        form.setError("password", {
          type: "custom",
          message: "Sua senha pode estar errada.",
        })
      const setWrongEmail = () =>
        form.setError("email", {
          type: "custom",
          message: "Seu email pode estar errado.",
        })
      if (error instanceof FirebaseError) {
        if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
          setWrongEmail()
          setWrongPassword()
        } else if (
          error.code === AuthErrorCodes.INVALID_EMAIL ||
          error.code === AuthErrorCodes.USER_DELETED
        ) {
          setWrongEmail()
        } else if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
          setWrongPassword()
        }
      }
    }
  }

  return (
    <>
      <BlueColorScreen />
      <LoginForm onSubmit={submitCallback} />
    </>
  )
}
