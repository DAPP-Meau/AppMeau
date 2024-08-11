import CreatePetForm from "@/components/organisms/CreatePetForm"
import Colors from "@/constants/Colors"
import { createPetAction } from "@/services/api/pet/createPetAction"
import { FirebaseAppContext } from "@/utils/store/firebaseAppContext"
import { useNavigation } from "@react-navigation/native"
import { useContext } from "react"
import React, { ScrollView, StyleSheet } from "react-native"

export default function PetRegistration() {
  const navigation = useNavigation()
  const firebaseApp = useContext(FirebaseAppContext)

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
