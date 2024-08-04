import { Text, View } from "react-native"
import React from "react"
import { Address, PetRegistrationDocument } from "@/services/models"
import { Card, IconButton, useTheme } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { PetAndOwnerDocument } from "@/services/actions"
import { RootStackParamList } from "@/app/Navigation/RootStack"
import { Image } from 'expo-image'

interface IPetCardsProps {
  petAndOwner: PetAndOwnerDocument
}

export default function PetCard({ petAndOwner }: IPetCardsProps) {
  const pet = petAndOwner.pet.data
  const { address } = petAndOwner.user.data
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const theme = useTheme()

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

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <Card
      style={{ marginVertical: 5, marginHorizontal: 18 }}
      onPress={() => {
        navigation.navigate("petDetails", { petAndOwner: petAndOwner })
      }}
    >
      {/* O título do cartão não tem como diminuir a altura sem quebrar outras
      coisas :( */}
      <Card.Title
        title={pet.animal.name}
        style={{ backgroundColor: theme.colors.primaryContainer }}
        right={(props) => (
          <IconButton
            {...props}
            icon="heart-outline"
            iconColor={theme.colors.onPrimaryContainer}
            onPress={() => {
              /*TODO função de favoritar*/
            }}
            size={20}
          />
        )}
      />
      <Image
        style={{ height: 150 }}
        source={pet.animal.picture_uid}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />

      <View style={{ padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Text>{machoFemea(pet)}</Text>
          <Text>{idade(pet)}</Text>
          <Text>{tamanho(pet)}</Text>
        </View>
        <View>
          <Text style={{ textAlign: "center" }}>{endereco(address)}</Text>
        </View>
      </View>
    </Card>
  )
}
