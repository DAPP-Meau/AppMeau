import CreateUserForm from "@/components/organisms/CreateUserForm"
import Colors from "@/constants/Colors"
import { createUserAction } from "@/services/api/user/createUserAction"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { useContext } from "react"
import React, { Alert, ScrollView, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { BlueColorScreen } from "@/components/atoms/ScreenColorScheme"
import { StackNavigationProp } from "@react-navigation/stack"
import { LayoutParamList } from "../Navigation/Layout"

export default function UserRegistration() {
  const navigation = useNavigation<StackNavigationProp<LayoutParamList>>()
  const firebaseApp = useContext(FirebaseAppContext)

  return (
    <View>
      <BlueColorScreen />
      <ScrollView contentContainerStyle={styles.container}>
        <CreateUserForm
          onSubmit={async (form) => {
            createUserAction(form, firebaseApp)
              .then(() => {
                Alert.alert(
                  "Seu usuário: foi criado com sucesso. Faça o login!",
                )
                navigation.navigate("login")
                // form.reset()
              })
              .catch((e) => () => {
                Alert.alert("Houve um erro na criação de usuário" + e)
              })
          }}
        />
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
