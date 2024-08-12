import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import {
  ActivityIndicator,
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
import getPetAndOwnerAction from "@/services/api/pet/getPetAndOwnerAction"
import { PetAndOwnerDocument } from "@/models"
import getCurrentUserUID from "@/utils/getCurrentUser"
import { blurhash } from "@/constants/blurhash"
import { toggleInterestedInPet } from "@/services/api/pet/toggleInterestedInPet"

type Props = DrawerScreenProps<RootStackParamList, "petDetails">

export default function PetDetails({ route, navigation }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const firebaseApp = useContext(FirebaseAppContext)
  const loggedInUserID = getCurrentUserUID(firebaseApp)

  const [loading, setLoading] = useState(true)
  const [petAndOwner, setPetAndOwner] = useState<
    PetAndOwnerDocument | undefined
  >(undefined)
  // Pegar dados do banco
  useEffect(() => {
    setLoading(true)
    getPetAndOwnerAction(route.params.petID, firebaseApp)
      .then((value) => {
        setPetAndOwner(value)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [loading, route])

  const [userIsOwner, setUserIsOwner] = useState(false)
  const [interested, setInterested] = useState(false)
  // Trocar estado do interesse do usuário e de usuário é dono
  useEffect(() => {
    if (loggedInUserID && petAndOwner) {
      setInterested(
        petAndOwner.pet.data.interestedUsersList?.includes(loggedInUserID) ??
          false,
      )
      setUserIsOwner(loggedInUserID === petAndOwner.user.id)
    }
  }, [loggedInUserID, petAndOwner])

  // Função para setar botão de compartilhar no cabeçalho
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconButton icon="share-variant" onPress={SharePet} />,
    })
  }, [navigation])

  // Função para setar título no cabeçalho
  useEffect(() => {
    navigation.setOptions({
      title: petAndOwner?.pet.data.animal.name ?? "Carregando...",
    })
  }, [navigation, petAndOwner])

  const HandleEditPet = () => {
    Alert.alert("função ainda não implementada")
  }

  const PetRemove = () => {
    Alert.alert("função ainda não implementada")
  }

  const SharePet = () => {
    Alert.alert("função ainda não implementada")
  }

  const TogglePetFavourite = () => {
    Alert.alert("função ainda não implementada")
  }

  const [loadingToggleInterest, setLoadingToggleInterest] = useState(false)
  const TogglePetInterest = () => {
    if (petAndOwner) {
      setLoadingToggleInterest(true)
      // Lidar com o valor no servidor
      toggleInterestedInPet(petAndOwner.pet.id, firebaseApp)
        .then((pet) => {
          petAndOwner.pet.data = pet
          setPetAndOwner(petAndOwner)
        })
        .finally(() => {
          setLoadingToggleInterest(false)
        })
    }
  }

  const [isImageZoomModalOpen, setIsImageZoomModalOpen] = useState(false)

  if (!petAndOwner || loading) {
    return <ActivityIndicator />
  } else {
    const pet = petAndOwner.pet.data
    const owner = petAndOwner.user.data
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
                source={pet.picture_url}
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
                source={pet.picture_url}
                placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
              />
            </TouchableOpacity>
          </View>
          {userIsOwner ? ( // Usuário é dono
            <FAB
              style={styles.fab}
              icon={"pencil"}
              variant="surface"
              size="medium"
              onPress={() => {
                HandleEditPet()
              }}
            />
          ) : (
            // Usuário não é dono
            <FAB
              style={styles.fab}
              icon={interested ? "heart" : "heart-outline"}
              variant="surface"
              size="medium"
              onPress={TogglePetFavourite}
            />
          )}

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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              {userIsOwner ? (
                <>
                  <Button
                    mode="contained"
                    onPress={() => {
                      navigation.navigate("UserList", {
                        petId: petAndOwner?.pet.id,
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
                </>
              ) : (
                <Button
                  mode="contained"
                  style={{ flex: 1 }}
                  onPress={TogglePetInterest}
                  loading={loadingToggleInterest}
                >
                  <Text>Estou interessado</Text>
                </Button>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
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
