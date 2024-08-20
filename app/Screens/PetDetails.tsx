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
  ProgressBar,
  Snackbar,
  useTheme,
} from "react-native-paper"
import { ScrollView } from "react-native"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { RootStackParamList } from "../Navigation/RootStack"
import { Image } from "expo-image"
import { Zoomable } from "@likashefqet/react-native-image-zoom"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
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
import { isInterestedInPet } from "@/utils/isInterestedInPet"

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
    callback().finally(() => {
      setLoading(false)
    })

    async function callback() {
      const value = await getPetAndOwnerAction(route.params.petID, firebaseApp)
      setPetAndOwner(value)
    }
  }, [loading])

  const [userIsOwner, setUserIsOwner] = useState(false)
  const [interested, setInterested] = useState(false)

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
    Alert.alert("Editar: função ainda não implementada")
  }

  const PetRemove = () => {
    Alert.alert("Remover: função ainda não implementada")
  }

  const SharePet = () => {
    Alert.alert("Compartilhar: função ainda não implementada")
  }

  const TogglePetFavourite = () => {
    Alert.alert("Favoritar: função ainda não implementada")
  }

  const [interstSnackbarVisible, setInterstSnackbarVisible] = useState(false)
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
          setInterstSnackbarVisible(true)
        })
    }
  }

  // Trocar estado do interesse do usuário e de usuário é dono
  useEffect(() => {
    if (loggedInUserID && petAndOwner) {
      const localIsInterested = isInterestedInPet(
        petAndOwner.pet.data.interestedUsersList,
        loggedInUserID,
      )
      setInterested(localIsInterested)
      setUserIsOwner(loggedInUserID === petAndOwner.user.id)
    }
  }, [loggedInUserID, petAndOwner, loadingToggleInterest])

  const [isImageZoomModalOpen, setIsImageZoomModalOpen] = useState(false)

  if (!petAndOwner || loading) {
    return <ProgressBar indeterminate />
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
          <Snackbar
            visible={interstSnackbarVisible}
            onDismiss={() => setInterstSnackbarVisible(false)}
          >
            {interested ? (
              <Text style={{ color: theme.colors.onTertiary }}>
                Seu interesse foi armazenado com sucesso
              </Text>
            ) : (
              <Text style={{ color: theme.colors.onTertiary }}>
                Seu interesse no pet foi removido
              </Text>
            )}
          </Snackbar>
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
          <FAB
            style={styles.fab}
            icon={userIsOwner ? "pencil" : "heart-outline"}
            variant="secondary"
            size="medium"
            onPress={userIsOwner ? HandleEditPet : TogglePetFavourite}
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
            {pet.animal.story && (
              <>
                <Divider />
                <View style={{ flexDirection: "row" }}>
                  <HeaderAndText title={"Mais Sobre " + pet.animal.name}>
                    <Text>{pet.animal.story}</Text>
                  </HeaderAndText>
                </View>
              </>
            )}
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
                  disabled={loadingToggleInterest}
                >
                  {!interested ? (
                    <Text>Estou interessado</Text>
                  ) : (
                    <Text>Não estou mais interessado</Text>
                  )}
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
      borderWidth: 0.5,
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
