import PetDetails from "@/components/elements/display/PetDetails"
import PetCard from "@/components/elements/PetCard"
import getPetAction from "@/services/actions/getPetAction"
import getUserAction from "@/services/actions/getUserAction"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import {
  PetRegistrationDocument,
  UserRegistrationDocument,
} from "@/services/models"
import { useLocalSearchParams } from "expo-router"
import React, { useContext, useMemo, useState } from "react"
import { View } from "react-native"
import { ActivityIndicator } from "react-native-paper"

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

export default function ShowPet() {
  const { petID } = useLocalSearchParams()
  const firebaseApp = useContext(FirebaseAppContext)
  const [petData, setPetData] = useState<PetRegistrationDocument|undefined>()
  const [ownerData, setOwnerData] = useState<UserRegistrationDocument|undefined>()

  useMemo(async () => {
    const pet = await getPetAction(petID as string, firebaseApp)
    if(!pet) {return}
    setPetData(pet)

    const userData = await getUserAction(pet.animal.owner_uid, firebaseApp)
    if(!userData) {return}
    setOwnerData(userData)
  }, [petID])

  // TODO: Tela de carregamento.
  return (
    <View>
      { petData && ownerData 
        ? <PetDetails pet={petData} owner={ownerData} />
        : <ActivityIndicator />
      }
    </View>
  )
}
