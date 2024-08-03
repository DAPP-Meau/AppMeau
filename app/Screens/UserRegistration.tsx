import CreateUserForm from "@/components/completedForms/CreateUserForm"
import { lightModeBlueTheme } from "@/constants"
import Colors from "@/constants/Colors"
import { createUserAction } from "@/services/actions/createUserAction"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { useContext } from "react"
import React, { ScrollView, StatusBar, StyleSheet } from "react-native"
import { PaperProvider } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"

export default function UserRegistration() {
  const navigation = useNavigation()
  const firebaseApp = useContext(FirebaseAppContext)

  return (
    <PaperProvider theme={lightModeBlueTheme}>
      <StatusBar backgroundColor={Colors.tintLight.blue1} />
      <ScrollView contentContainerStyle={styles.container}>
        <CreateUserForm
          onSubmit={async (fields, form) => {
            await createUserAction(fields, form, firebaseApp, navigation)
          }}
        />
      </ScrollView>
    </PaperProvider>
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
