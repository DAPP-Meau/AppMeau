import PetCard from "@/components/elements/PetCard"
import { collections } from "@/constants"
import getPetAction from "@/services/actions/getPetAction"
import getUserAction from "@/services/actions/getUserAction"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import {
  PetRegistrationDocument,
  UserRegistrationDocument,
} from "@/services/models"
import { useLocalSearchParams } from "expo-router"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore"
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

export async function obterPetAction() {
  const list = []
  const firebaseApp = useContext(FirebaseAppContext)
  const db = getFirestore(firebaseApp)
  const q = query(collection(db, "pets"))
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    list.push(doc.id)
  })

  return list
}

export default function ShowPet() {
  //pegar todos os IDS do cloud e passar todos aqui
  const [list, setList] = useState<Array<string> | undefined>()
  const { petID } = useLocalSearchParams()
  const firebaseApp = useContext(FirebaseAppContext)
  const [petData, setPetData] = useState<PetRegistrationDocument | undefined>()
  const [ownerData, setOwnerData] = useState<
    UserRegistrationDocument | undefined
  >()

  useMemo(async () => {
    const petlist = await obterPetAction()
    setList(petlist)
    const pet = await getPetAction(petlist[7] as string, firebaseApp)
    if (!pet) {
      return
    }
    setPetData(pet)

    const userData = await getUserAction(pet.animal.owner_uid, firebaseApp)
    if (!userData) {
      return
    }
    setOwnerData(userData)
  }, [petID])

  // TODO: Tela de carregamento.
  return (
    <View>
      {petData && ownerData ? (
        <PetCard pet={petData} owner={ownerData} id={list[7]} />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  )
}
