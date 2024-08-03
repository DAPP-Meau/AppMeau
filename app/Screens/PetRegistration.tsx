import CreatePetForm from "@/components/completedForms/CreatePetForm"
import Colors from "@/constants/Colors"
import { createPetAction } from "@/services/actions"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { useNavigation } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { useContext } from "react"
import React, { ScrollView, StyleSheet } from "react-native"

export default function PetRegistration() {
  const navigation = useNavigation()
  const firebaseApp = useContext(FirebaseAppContext)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor={Colors.tintLight.yellow1} />
      <CreatePetForm
        onSubmit={async (fields, form) => {
          await createPetAction(fields, form, firebaseApp, navigation)
        }}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.background.default,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
})
