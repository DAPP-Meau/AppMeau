import React, { useContext } from "react"
import { getAuth } from "firebase/auth"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { loginAction } from "@/services/actions"
import LoginForm, { LoginFields } from "@/components/completedForms/LoginForm"
import { Button, PaperProvider, Text } from "react-native-paper"
import { lightModeBlueTheme } from "@/constants"
import { useNavigation } from "@react-navigation/native"

export default function Login() {
  const navigation = useNavigation()
  const firebaseapp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseapp)

  const debugUser: LoginFields = {
    username: "Isaac123*@gmail.com",
    password: "Isaac123*",
  }

  return (
    <PaperProvider theme={lightModeBlueTheme}>
      <LoginForm
        onSubmit={async (fields, form) => {
          return loginAction(auth, fields, form, navigation)
        }}
      />
      <Button
        mode="outlined"
        onPress={async () => loginAction(auth, debugUser, undefined, navigation)}
      >
        <Text>AUTO-LOGIN como Isaac123</Text>
      </Button>
    </PaperProvider>
  )
}
