import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import {
  Button,
  Divider,
  FAB,
  IconButton,
  MD3Theme,
  Modal,
  Portal,
  useTheme,
} from "react-native-paper"
import { ScrollView } from "react-native"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { RootStackParamList } from "../Navigation/RootStack"
import { Image } from "expo-image"
import { Zoomable } from "@likashefqet/react-native-image-zoom"
import { FirebaseAppContext } from "@/utils/store/firebaseAppContext"
import { getAuth } from "firebase/auth"
import {
  exigências,
  boolToSimNao,
  machoFemea,
  tamanho,
  idade,
  endereco,
  temperamento,
} from "@/utils/strings"
import HeaderAndText from "@/components/atoms/HeaderAndText"
import { HandleFavourite } from "@/services/api/pet/handleFavourite"

type Props = DrawerScreenProps<RootStackParamList, "petDetails">

export default function PetDetails({ route, navigation }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  const refreshList = route.params.refreshList
  const { id: petID, data: pet } = route.params.petAndOwner.pet
  const { id: ownerID, data: owner } = route.params.petAndOwner.user

  const firebaseApp = useContext(FirebaseAppContext)
  const loggedInUserUID = getAuth(firebaseApp).currentUser?.uid

  const userIsOwner = loggedInUserUID && ownerID === loggedInUserUID

  const [interested, setInterested] = useState(false)
  useEffect(() => {
    if (loggedInUserUID) {
      setInterested(pet.interested.includes(loggedInUserUID))
    }
  }, [loggedInUserUID, pet])

  // Função para setar botão de compartilhar no cabeçalho
  useEffect(() => {
    navigation.setOptions({
      title: pet.animal.name,
      headerRight: () => (
        <IconButton
          icon="share-variant"
          onPress={() => {
            /* TODO: Botão de compartilhar pet*/
          }}
        />
      ),
    })
  }, [navigation])

  const HandleEditPet = () => {
    Alert.alert("função ainda não implementada")
  }

  const PetRemove = () => {
    Alert.alert("função ainda não implementada")
  }

  const [isImageZoomModalOpen, setIsImageZoomModalOpen] = useState(false)
  const blurhash =
    "fSSh}iWVo~ofbxofX=WBaJj?nzj@rna#f6j?aef6vva}kCj@WYayV=ayaxj[ocfQ"

  return (
    <ScrollView>
      {/* Modal de zoom da imagem */}
      <Portal>
        <Modal
          visible={isImageZoomModalOpen}
          onDismiss={() => {
            setIsImageZoomModalOpen(false)
          }}
          contentContainerStyle={styles.modalContent}
          style={{ elevation: 0 }}
        >
          <Zoomable isDoubleTapEnabled doubleTapScale={2}>
            <Image
              style={styles.image}
              source={pet.animal.picture_uid}
              placeholder={{ blurhash }}
              contentFit="scale-down"
              transition={1000}
            />
          </Zoomable>
        </Modal>
      </Portal>

      {/* Resto da tela */}
      <View style={{ gap: 16 }}>
        <View style={{ height: 150 }}>
          <TouchableOpacity
            onPress={() => {
              setIsImageZoomModalOpen(true)
            }}
          >
            <Image
              style={{ height: 150 }}
              source={pet.animal.picture_uid}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
          </TouchableOpacity>
        </View>
        <FAB
          style={styles.fab}
          icon={userIsOwner ? "pencil" : interested ? "heart" : "heart-outline"}
          variant="surface"
          size="medium"
          onPress={() => {
            userIsOwner
              ? HandleEditPet()
              : HandleFavourite(firebaseApp, pet, petID, (value) => {
                  setInterested(value)
                  Alert.alert(
                    pet.animal.name 
                    + " foi " 
                    + (value
                      ? "removido dos"
                      : "adicionado aos")
                    + " seus interesses",
                  )
                  refreshList()
                })
          }} // Ação depende se é dono ou não}
        />
        <View style={{ paddingHorizontal: 20, gap: 16, paddingBottom: 100 }}>
          <Text style={styles.animalName}>{pet.animal.name}</Text>
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: "row", gap: 50 }}>
              <HeaderAndText title="Sexo">
                <Text>{machoFemea(pet)}</Text>
              </HeaderAndText>
              <HeaderAndText title="Porte">
                <Text>{tamanho(pet)}</Text>
              </HeaderAndText>
              <HeaderAndText title="Idade">
                <Text>{idade(pet)}</Text>
              </HeaderAndText>
            </View>
            <View>
              <HeaderAndText title="Localização" style={{ flex: 0 }}>
                <Text>{endereco(owner)}</Text>
              </HeaderAndText>
            </View>
          </View>
          <Divider />
          <View style={{ gap: 8 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <HeaderAndText title="Castrado">
                <Text>{boolToSimNao(pet.health.neutered)}</Text>
              </HeaderAndText>
              <HeaderAndText title="Vermifugado">
                <Text>{boolToSimNao(pet.health.dewormed)}</Text>
              </HeaderAndText>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              <HeaderAndText title="Vacinado">
                <Text>{boolToSimNao(pet.health.vaccinated)}</Text>
              </HeaderAndText>
              <HeaderAndText title="Doenças">
                <Text>{pet.health.sicknesses ? "" : "Nenhuma"}</Text>
              </HeaderAndText>
            </View>
          </View>
          <Divider />
          <View style={{ flexDirection: "row" }}>
            <HeaderAndText title="Temperamento">
              <Text>{temperamento(pet)}</Text>
            </HeaderAndText>
          </View>
          <Divider />
          <View style={{ flexDirection: "row" }}>
            <HeaderAndText title="Exigências do doador">
              <Text>{exigências(pet)}</Text>
            </HeaderAndText>
          </View>
          <Divider />
          <View style={{ flexDirection: "row" }}>
            <HeaderAndText title={"Mais Sobre " + pet.animal.name}>
              <Text>{pet.animal.story}</Text>
            </HeaderAndText>
          </View>
          {userIsOwner && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <Button
                mode="contained"
                onPress={() => {
                  navigation.navigate("UserList", {
                    petId: route.params.petAndOwner.pet.id,
                  })
                }}
              >
                Ver Interessados
              </Button>
              <Button
                mode="contained"
                style={{ flex: 1 }}
                onPress={() => PetRemove()}
              >
                <Text>Remover Pet</Text>
              </Button>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    baseColor: {
      color: theme.colors.onBackground,
    },
    animalName: {
      textTransform: "capitalize",
      fontWeight: "bold",
      fontSize: 16,
    },
    photo: {
      height: 150,
      width: "100%",
    },
    fab: {
      position: "absolute",
      margin: 15,
      right: 0,
      top: 115,
      borderColor: "black",
      borderWidth: 1,
    },
    modalContent: {
      backgroundColor: "transparent",
      alignSelf: "center",
      alignItems: "center",
      aspectRatio: 1,
      maxWidth: "80%",
      height: "40%",
    },
    image: {
      flex: 1,
      alignSelf: "flex-end",
      maxWidth: "100%",
      aspectRatio: 1,
    },
  })
