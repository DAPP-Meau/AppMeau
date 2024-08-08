import {  StyleSheet, Text, View } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { Address, PetRegistrationDocument } from "@/services/models"
import { Card, IconButton, MD3Theme, useTheme } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { PetAndOwnerDocument } from "@/services/actions"
import { RootStackParamList } from "@/app/Navigation/RootStack"
import { Image } from "expo-image"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { getAuth } from "firebase/auth"
import { arrayRemove, arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore"
import { collections } from "@/constants"

interface IPetCardsProps {
  petAndOwner: PetAndOwnerDocument
  proOnRefresh: ()=>void
}


export default function PetCard({ petAndOwner, proOnRefresh }: IPetCardsProps) {
  const pet = petAndOwner.pet.data
  const { address } = petAndOwner.user.data
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const theme = useTheme()
  const styles = makeStyles(theme)
  const firebaseApp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseApp)
  const user = auth.currentUser;
  const uid = user?.uid;
  const [interesse, setinteresse] = useState(false);
  useEffect(() => {
    if (uid && pet.interested.includes(uid)) {
      setinteresse(true);
    }
    else{
      setinteresse(false);
    }
  }, [uid, pet]);
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

  const handleFavorite = async () => {
    //TODO:não esta tendo refresh da tela
    
    const db = getFirestore(firebaseApp);
    const idpet = petAndOwner.pet.id;
    const ref = doc(db, collections.pets, idpet);
    const data = uid;
    if (uid && pet.interested.includes(uid)) {
      try {
        await updateDoc(ref, {
          interested: arrayRemove(data)
      });
      //não esta removendo do bd
      setinteresse(false);
      proOnRefresh();
      } catch (error) {
        console.error("Erro ao remover UID para o Firebase: ", error);
      }
    } else {
      try {
        await updateDoc(ref, {
          interested: arrayUnion(data)
        });
        setinteresse(true);
        proOnRefresh();
      } catch (error) {
        console.error("Erro ao enviar UID para o Firebase: ", error);
      }
    }

  };

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
        navigation.navigate("petDetails", { petAndOwner: petAndOwner, proOnRefresh: proOnRefresh })
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
        <Text style={{ fontSize: 18 }}>{pet.animal.name}</Text>
        <IconButton
          icon={interesse ? "heart" : "heart-outline"}
          iconColor={theme.colors.onPrimaryContainer}
          onPress={handleFavorite}
          size={20}
        />
      </View>
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
          <Text style={styles.text}>{machoFemea(pet)}</Text>
          <Text style={styles.text}>{idade(pet)}</Text>
          <Text style={styles.text}>{tamanho(pet)}</Text>
        </View>
        <View>
          <Text style={{ textAlign: "center", color: theme.colors.onSurface }}>
            {endereco(address)}
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
