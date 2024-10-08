import { StyleSheet, Text, View } from "react-native"
import React from "react"
import { Card, IconButton, MD3Theme, useTheme } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "@/app/Navigation/RootStack"
import { Image } from "expo-image"
import { endereco, idade, machoFemea, tamanho } from "@/utils/strings"
import { PetAndOwnerDocument } from "@/models"
import { blurhash } from "@/constants/blurhash"

interface IPetCardsProps {
  petAndOwner: PetAndOwnerDocument
  onFavourite?: () => void
  loadingInterest?: boolean
}

export default function PetCard({
  petAndOwner,
  onFavourite,
  loadingInterest
}: IPetCardsProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const { id: petID, data: petData } = petAndOwner.pet
  const ownerData = petAndOwner.user.data
  
  return (
    <Card
      style={{
        backgroundColor: theme.colors.surface,
      }}
      onPress={() => {
        navigation.navigate("petDetails", { petID: petID })
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.primaryContainer,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 18,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 18 }}>{petData.animal.name}</Text>
        <IconButton
          icon={"heart-outline"}
          iconColor={theme.colors.onPrimaryContainer}
          loading={loadingInterest}
          onPress={onFavourite}
          size={20}
        />
      </View>
      <Image
        style={{ height: 150 }}
        source={petData.picture_url}
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
          <Text style={styles.text}>{machoFemea(petData)}</Text>
          <Text style={styles.text}>{idade(petData)}</Text>
          <Text style={styles.text}>{tamanho(petData)}</Text>
        </View>
        <View>
          <Text style={{ textAlign: "center", color: theme.colors.onSurface }}>
            {endereco(ownerData)}
          </Text>
        </View>
      </View>
    </Card>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    text: {
      textTransform: "uppercase",
      color: theme.colors.onSurface,
    },
  })
