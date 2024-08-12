import CreateUserForm, {
  UserRegistrationFields,
} from "@/components/organisms/CreateUserForm"
import Colors from "@/constants/Colors"
import { createUserAction } from "@/services/api/user/createUserAction"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { useContext } from "react"
import React, { Alert, ScrollView, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { BlueColorScreen } from "@/components/atoms/ScreenColorScheme"
import { StackNavigationProp } from "@react-navigation/stack"
import { LayoutParamList } from "../Navigation/Layout"
import { UseFormReturn } from "react-hook-form"
import { FirebaseError } from "firebase/app"
import { AuthErrorCodes } from "firebase/auth"

export default function UserRegistration() {
  const navigation = useNavigation<StackNavigationProp<LayoutParamList>>()
  const firebaseApp = useContext(FirebaseAppContext)

  const createUserCallback = async (
    form: UseFormReturn<UserRegistrationFields>,
  ) => {
    try {
      await createUserAction(form, firebaseApp)
      Alert.alert("Seu usuário: foi criado com sucesso. Faça o login!")
      navigation.navigate("login")
      form.reset()
    } catch (error) {
      if (error instanceof FirebaseError) {
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
        }
      }
    }
  }

  return (
    <View>
      <BlueColorScreen />
      <ScrollView contentContainerStyle={styles.container}>
        <CreateUserForm onSubmit={createUserCallback} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.background.default,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
})
