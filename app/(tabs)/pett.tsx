import { StyleSheet, View } from "react-native"
import React from "react"
import PetDetails from "@/components/elements/display/PetDetails"
import {
  PetRegistrationDocument,
  UserRegistrationDocument,
} from "@/services/models"

export default function ShowPet() {
  const testPet: PetRegistrationDocument = {
    animal: {
      age: "adult",
      name: "Nome Do Pet Teste",
      owner_uid: "none",
      picture_uid: "none",
      sex: "female",
      size: "large",
      species: "cat",
      story: "Essa é uma história de um cachorro de testes",
    },
    adoptionRequirements: {
      requireAdoptionTerm: true,
      requireHousePhoto: false,
      requireMonitoring: true,
      requirePreviousVisit: false,
    },
    health: {
      dewormed: true,
      neutered: false,
      sick: false,
      vaccinated: true,
      sicknesses: "",
    },
    temperament: {
      calm: true,
      guard: false,
      lazy: true,
      loving: false,
      playful: true,
      shy: false,
    },
  }

  const testeUser: UserRegistrationDocument = {
    person: {
      picture_uid:
        "https://firebasestorage.googleapis.com/v0/b/meau-app-1b023.appspot.com/o/photo%2Fusers%2F876f0754-bdb5-4dd3-b1b6-084012c32902_Image_User.jpeg?alt=media&token=f366a1d5-8594-4695-b6e7-35e6f04f7116",
      age: 49,
      phone: "(88)98370-6874",
      fullName: "Beatriz Carla Silva",
    },
    login: { username: "Beatriz Silva", email: "Beatriz123*@gmail.com" },
    address: {
      fullAddress: "Rua Leda Prado Paula Pessoa",
      state: "CE",
      city: "Sobral",
    },
  }

  return (
    <View>
      <PetDetails pet={testPet} owner={testeUser} />
    </View>
  )
}

const styles = StyleSheet.create({})
