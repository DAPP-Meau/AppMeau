import React, { useContext } from "react"
import { getAuth } from "firebase/auth"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { loginAction } from "@/services/api/auth/loginAction"
import LoginForm, { LoginFields } from "@/components/organisms/LoginForm"
import { Button, Text } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { BlueColorScreen } from "@/components/atoms/ScreenColorScheme"
import Constants from "expo-constants"

export default function Login() {
  const navigation = useNavigation()
  const firebaseapp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseapp)

  const isRunningInExpoGo = Constants.appOwnership === "expo"
  let debugUser: LoginFields | undefined = undefined
  if (
    isRunningInExpoGo &&
    process.env.EXPO_PUBLIC_DEBUG_USERNAME &&
    process.env.EXPO_PUBLIC_DEBUG_PASSWORD
  ) {
    debugUser = {
      username: process.env.EXPO_PUBLIC_DEBUG_USERNAME,
      password: process.env.EXPO_PUBLIC_DEBUG_PASSWORD,
    }
  }

  return (
    <>
      <BlueColorScreen />
      <LoginForm
        onSubmit={async (fields, form) => {
          return loginAction(auth, fields, form, navigation)
        }}
      />
      {debugUser &&
        isRunningInExpoGo && ( // Renderizar se tiver variável de login e no expo GO
          <Button
            mode="outlined"
            onPress={async () =>
              loginAction(auth, debugUser, undefined, navigation)
            }
          >
            <Text>AUTO-LOGIN como {debugUser.username}</Text>
          </Button>
        )}
    </>
  )
}
