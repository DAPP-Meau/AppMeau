import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { Address, PetRegistrationDocument } from "@/services/models"
import { Card, MD3Theme, Title } from "react-native-paper"
import Colors from "@/constants/Colors"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { HomeDrawerParamList } from "@/app/Navigation/HomeDrawer"
import { PetAndOwnerDocument } from "@/services/actions"

interface IPetCardsProps {
  petAndOwner: PetAndOwnerDocument
}

export default function PetCard({ petAndOwner }: IPetCardsProps) {
  const pet = petAndOwner.pet.data
  const { address } = petAndOwner.user.data
  const navigation = useNavigation<StackNavigationProp<HomeDrawerParamList>>()

  const machoFemea = (pet: PetRegistrationDocument) => {
    switch (pet.animal.sex) {
      case "female":
        return "Fêmea"
      case "male":
        return "Macho"
    }
  }

  const tamanho = (pet: PetRegistrationDocument) => {
    switch (pet.animal.size) {
      case "large":
        return "Grande"
      case "medium":
        return "Médio"
      case "small":
        return "Pequeno"
    }
  }

  const idade = (pet: PetRegistrationDocument) => {
    switch (pet.animal.age) {
      case "adult":
        return "Adulto"
      case "cub":
        return "Filhote"
      case "old":
        return "Idoso"
    }
  }

  const endereco = (address: Address): string => {
    return address.fullAddress + " - " + address.city + ", " + address.state
  }

  return (
    <Card
      style={{ margin: 16, borderRadius: 10 }}
      onPress={() => {
        navigation.navigate("petDetails", {petAndOwner: petAndOwner})
      }}
    >
      <Card.Content style={{ backgroundColor: Colors.tintLight.yellow1 }}>
        <Title>{pet.animal.name}</Title>
      </Card.Content>
      <Card.Cover
        source={
          pet.animal.picture_uid
            ? { uri: pet.animal.picture_uid }
            : // TODO imagem de carreamento
              require("@/assets/images/Meau_marca_2.png")
        }
        style={{ height: 150 }}
        resizeMode="cover"
      />
      <Card.Content
        style={{ paddingHorizontal: 20, gap: 16, paddingBottom: 20 }}
      >
        <View style={{ gap: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 50,
            }}
          >
            <Text>{machoFemea(pet)}</Text>
            <Text>{tamanho(pet)}</Text>
            <Text>{idade(pet)}</Text>
          </View>
          <View>
            <Text style={{ textAlign: "center" }}>{endereco(address)}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}
