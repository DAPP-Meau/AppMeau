import React, { useContext } from "react"
import { AuthErrorCodes, getAuth } from "firebase/auth"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { loginAction } from "@/services/api/auth/loginAction"
import LoginForm, { LoginFields } from "@/components/organisms/LoginForm"
import { useNavigation } from "@react-navigation/native"
import { BlueColorScreen } from "@/components/atoms/ScreenColorScheme"
import { Alert } from "react-native"
import { DrawerNavigationProp } from "@react-navigation/drawer"
import { LayoutParamList } from "../Navigation/Layout"
import { UseFormReturn } from "react-hook-form"
import { FirebaseError } from "firebase/app"

export default function Login() {
  const navigation = useNavigation<DrawerNavigationProp<LayoutParamList>>()
  const firebaseapp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseapp)

  const submitCallback = async (form: UseFormReturn<LoginFields>) => {
    try {
      await loginAction(form, auth)
      form.reset()
      Alert.alert("Bem vindo!")
      navigation.navigate("rootStack")
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
