import CreateUserForm from "@/components/completedForms/CreateUserForm"
import Colors from "@/constants/Colors"
import { createUserAction } from "@/services/actions/createUserAction"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { useContext, useEffect } from "react"
import React, { ScrollView, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ColorSchemeContext } from "@/services/ColorSchemeContext"

export default function UserRegistration() {
  const navigation = useNavigation()
  const firebaseApp = useContext(FirebaseAppContext)
  const theme = useContext(ColorSchemeContext)

  useEffect(() => {
    theme.setColorScheme("blue")
    return () => {
      theme.setColorScheme("yellow")
    }
  }, [theme])

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <CreateUserForm
          onSubmit={async (fields, form) => {
            await createUserAction(fields, form, firebaseApp, navigation)
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
