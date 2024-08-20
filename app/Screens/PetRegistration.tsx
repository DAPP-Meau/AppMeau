import CreatePetForm, { PetRegistrationFields } from "@/components/organisms/CreatePetForm"
import Colors from "@/constants/Colors"
import { createPetAction } from "@/services/api/pet/createPetAction"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useContext } from "react"
import React, { ScrollView, StyleSheet } from "react-native"
import { RootStackParamList } from "../Navigation/RootStack"
import { UseFormReturn } from "react-hook-form"

export default function PetRegistration() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const firebaseApp = useContext(FirebaseAppContext)

  const petRegistrationCallback = async (form: UseFormReturn<PetRegistrationFields>) => {
    await createPetAction(form, firebaseApp)
    form.reset()
    navigation.navigate("addPetsSuccess")
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CreatePetForm
        onSubmit={petRegistrationCallback}
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
