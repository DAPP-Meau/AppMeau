import { RootStackParamList } from "@/app/Navigation/RootStack"
import { blurhash } from "@/constants/blurhash"
import { Pet, Snapshot } from "@/models"
import { usuariosInteressados } from "@/utils/strings"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { Image } from "expo-image"
import React, { Text, View } from "react-native"
import { Card, useTheme } from "react-native-paper"

export interface IMyPetCardProps {
  pet: Snapshot<Pet>
}

export default function MyPetCard({ pet }: IMyPetCardProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const theme = useTheme()
  const { data: petData, id } = pet

  return (
    <Card
      onPress={() => {
        navigation.navigate("petDetails", { petID: id })
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: 5,
        }}
      >
        <Image
          style={{ height: 80, aspectRatio: 1, borderRadius: 5 }}
          source={petData.picture_url}
          placeholder={{ blurhash }}
          contentFit="scale-down"
          transition={1000}
        />
        <View style={{ flexDirection: "column" }}>
          <Text style={{ fontSize: 18 }}>{petData.animal.name}</Text>
          <Text>
            {usuariosInteressados(petData.interestedUsersList?.length ?? 0)}
          </Text>
        </View>
      </View>
    </Card>
  )
}
