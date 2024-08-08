import { StyleSheet, Text, View } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { Card, IconButton, MD3Theme, useTheme } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { PetAndOwnerDocument } from "@/services/actions"
import { RootStackParamList } from "@/app/Navigation/RootStack"
import { Image } from "expo-image"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { getAuth } from "firebase/auth"
import {
  arrayRemove,
  arrayUnion,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore"
import { collections } from "@/constants"
import { endereco, idade, machoFemea, tamanho } from "@/services/strings"

interface IPetCardsProps {
  petAndOwner: PetAndOwnerDocument
  onRefresh: () => void
}

export default function PetCard({ petAndOwner, onRefresh }: IPetCardsProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const petData = petAndOwner.pet.data
  const userData = petAndOwner.user.data

  
  const firebaseApp = useContext(FirebaseAppContext)
  const loggedInUserUID = getAuth(firebaseApp).currentUser?.uid
  
  const [interested, setInterested] = useState(false)
  useEffect(() => {
    if (loggedInUserUID && petData.interested.includes(loggedInUserUID)) {
      setInterested(true)
    } else {
      setInterested(false)
    }
  }, [loggedInUserUID, petData])

  const handleFavorite = async () => {
    //TODO:não esta tendo refresh da tela
    const db = getFirestore(firebaseApp)
    const idpet = petAndOwner.pet.id
    const ref = doc(db, collections.pets, idpet)
    const data = loggedInUserUID
    if (loggedInUserUID && petData.interested.includes(loggedInUserUID)) {
      await updateDoc(ref, {
        interested: arrayRemove(data),
      })
    } else {
      await updateDoc(ref, {
        interested: arrayUnion(data),
      })
    }
    setInterested(true)
    onRefresh()
  }

  const blurhash =
    "fSSh}iWVo~ofbxofX=WBaJj?nzj@rna#f6j?aef6vva}kCj@WYayV=ayaxj[ocfQ"

  return (
    <Card
      style={{
        marginVertical: 5,
        marginHorizontal: 18,
        backgroundColor: theme.colors.surface,
      }}
      onPress={() => {
        navigation.navigate("petDetails", {
          petAndOwner: petAndOwner,
          refreshList: onRefresh,
        })
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
          icon={interested ? "heart" : "heart-outline"}
          iconColor={theme.colors.onPrimaryContainer}
          onPress={handleFavorite}
          size={20}
        />
      </View>
      <Image
        style={{ height: 150 }}
        source={petData.animal.picture_uid}
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
            {endereco(userData)}
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
