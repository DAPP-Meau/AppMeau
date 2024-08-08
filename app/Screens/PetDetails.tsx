import {
  Alert,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import React, { ReactNode, useContext, useEffect, useState } from "react"
import {
  PetRegistrationDocument,
  UserRegistrationDocument,
} from "@/services/models"
import {
  Button,
  Divider,
  FAB,
  IconButton,
  MD3Theme,
  Modal,
  Portal, useTheme
} from "react-native-paper"
import { ScrollView } from "react-native"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { RootStackParamList } from "../Navigation/RootStack"
import { Image } from "expo-image"
import { Zoomable } from "@likashefqet/react-native-image-zoom"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { getAuth } from "firebase/auth"
import { arrayRemove, arrayUnion,  doc, getFirestore,  updateDoc } from "firebase/firestore"
import { collections } from "@/constants"


type Props = DrawerScreenProps<RootStackParamList, "petDetails">

interface TitleAndTextProps {
  title: string
  children: ReactNode
  style?: StyleProp<ViewStyle>
  
}

export default function PetDetails({ route, navigation }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const proOnRefresh = route.params.proOnRefresh
  const pet = route.params.petAndOwner.pet.data
  const owner = route.params.petAndOwner.user.data
  const firebaseApp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseApp)
  const user = auth.currentUser;
  const uid = user?.uid;
  const [dono, setDono] = useState(false);
  useEffect(() => {
    if (uid === pet.animal.owner_uid) {
      setDono(true);
    }
  }, [uid, pet]);

  const [interesse, setinteresse] = useState(false);
  useEffect(() => {

    if (uid && pet.interested.includes(uid)) {
      setinteresse(true);
    }
    else{
      setinteresse(false);
    }
  }, [uid, pet]);




  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

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

  // Função para enviar UID para o Firebase
  const handleFavorite = async () => {
    //TODO:não esta tendo refresh da tela
    const db = getFirestore(firebaseApp);
    const idpet = route.params.petAndOwner.pet.id;
    const ref = doc(db, collections.pets, idpet);
    const data = uid;
    if (uid && pet.interested.includes(uid)) {
      try {
        await updateDoc(ref, {
          interested: arrayRemove(data)
      });
      //não esta removendo do bd
      setinteresse(false);
      Alert.alert(pet.animal.name + ' foi removida dos seus interesses');
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
        Alert.alert(pet.animal.name + ' foi adicionada aos seus interesses')
        proOnRefresh();

      } catch (error) {
        console.error("Erro ao enviar UID para o Firebase: ", error);
      }
    }

  };
  const handleEditPet = async () => {
    Alert.alert('função ainda não implementada')
  }

  const PetRemove = async () => {
    Alert.alert('Deseja realmente deletar o '+ pet.animal.name + 'do sistema?', undefined, [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: async () => {//TODO
        },
        style: "default",
      },])
    Alert.alert('função ainda não implementada')
  }
  function boolToSimNao(b: boolean) {
    return b ? "Sim" : "Não"
  }

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

  function capitalize(s: string) {
    return s[0].toUpperCase() + s.slice(1)
  }

  /** A partir de uma lista de strings, adiciona pontos e virgulas entre
   * elementos e "e" entre os últimos dois elementos.
   */
  function createTextFromList<T>(
    list: Array<T>,
    emptyMsg: string,
    separator = ", ",
  ) {
    return capitalize(
      list
        .filter((x) => x !== "") // Filtrar apenas as opções possíveis
        .flatMap((val, i, arr) => {
          // Colocar vírgulas e "e" na frase
          if (i < arr.length - 2) {
            return [val, separator]
          } else if (i <= arr.length - 2) {
            return [val, " e "]
          } else {
            return val
          }
        })
        .join("") || emptyMsg, // Mesclar numa string ou mostrar emptyMsg
    ) // Capitalizar primeiro caractere
  }

  const temperamento = (pet: PetRegistrationDocument): string => {
    return createTextFromList(
      [
        pet.temperament.calm ? "calmo" : "",
        pet.temperament.guard ? "guarda" : "",
        pet.temperament.lazy ? "preguiçoso" : "",
        pet.temperament.loving ? "amoroso" : "",
        pet.temperament.playful ? "brincalhão" : "",
        pet.temperament.shy ? "tímido" : "",
      ],
      "nenhum!",
    )
  }

  const exigências = (pet: PetRegistrationDocument): string => {
    return createTextFromList(
      [
        pet.adoptionRequirements.requireAdoptionTerm ? "Termo de adoção" : "",
        pet.adoptionRequirements.requireHousePhoto ? "fotos da casa" : "",
        pet.adoptionRequirements.requirePreviousVisit
          ? "visita prévia à casa"
          : "",
        pet.adoptionRequirements.requireMonitoring
          ? "acompanhamento pós adoção"
          : "",
      ],
      "nenhum!",
    )
  }

  const endereco = (owner: UserRegistrationDocument): string => {
    return (
      owner.address.fullAddress +
      " - " +
      owner.address.city +
      ", " +
      owner.address.state
    )
  }

  const blurhash =
    "fSSh}iWVo~ofbxofX=WBaJj?nzj@rna#f6j?aef6vva}kCj@WYayV=ayaxj[ocfQ"

  if (pet && owner) {



    return (
      <>
        {/* Modal de zoom da imagem */}
        <Portal>
          <Modal
            visible={isImageModalOpen}
            onDismiss={() => {
              setIsImageModalOpen(false)
            }}
            contentContainerStyle={{
              backgroundColor: "transparent",
              alignSelf: "center",
              alignItems: "center",
              aspectRatio: 1,
              maxWidth: "80%",
              height: "40%",
            }}
            style={{ elevation: 0 }}
          >
            <Zoomable
              isDoubleTapEnabled
              doubleTapScale={2}
            >
              <Image
                style={{
                  flex: 1,
                  alignSelf: "flex-end",
                  maxWidth: "100%",
                  aspectRatio: 1,
                }}
                source={pet.animal.picture_uid}
                placeholder={{ blurhash }}
                contentFit="scale-down"
                transition={1000}
              />
            </Zoomable>
          </Modal>
        </Portal>

        {/* Resto da tela */}
        <ScrollView>
          <View style={{ gap: 16 }}>
            <View style={{ height: 150 }}>
              <TouchableOpacity
                onPress={() => {
                  setIsImageModalOpen(true)
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
              icon={dono ? "pencil" : (interesse ? "heart" : "heart-outline")}
              variant="surface"
              size="medium"
              onPress={dono ? handleEditPet : handleFavorite} // Ação depende se é dono ou não}
            />
            <View style={{ paddingHorizontal: 20, gap: 16, paddingBottom: 100 }}>
              <Text style={styles.animalName}>{pet.animal.name}</Text>
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: "row", gap: 50 }}>
                  <TitleAndText title="Sexo">
                    <Text>{machoFemea(pet)}</Text>
                  </TitleAndText>
                  <TitleAndText title="Porte">
                    <Text>{tamanho(pet)}</Text>
                  </TitleAndText>
                  <TitleAndText title="Idade">
                    <Text>{idade(pet)}</Text>
                  </TitleAndText>
                </View>
                <View>
                  <TitleAndText title="Localização" style={{ flex: 0 }}>
                    <Text>{endereco(owner)}</Text>
                  </TitleAndText>
                </View>
              </View>
              <Divider />
              <View style={{ gap: 8 }}>
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-start" }}
                >
                  <TitleAndText title="Castrado">
                    <Text>{boolToSimNao(pet.health.neutered)}</Text>
                  </TitleAndText>
                  <TitleAndText title="Vermifugado">
                    <Text>{boolToSimNao(pet.health.dewormed)}</Text>
                  </TitleAndText>
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-start" }}
                >
                  <TitleAndText title="Vacinado">
                    <Text>{boolToSimNao(pet.health.vaccinated)}</Text>
                  </TitleAndText>
                  <TitleAndText title="Doenças">
                    <Text>{pet.health.sicknesses ? "" : "Nenhuma"}</Text>
                  </TitleAndText>
                </View>
              </View>
              <Divider />
              <View style={{ flexDirection: "row" }}>
                <TitleAndText title="Temperamento">
                  <Text>{temperamento(pet)}</Text>
                </TitleAndText>
              </View>
              <Divider />
              <View style={{ flexDirection: "row" }}>
                <TitleAndText title="Exigências do doador">
                  <Text>{exigências(pet)}</Text>
                </TitleAndText>
              </View>
              <Divider />
              <View style={{ flexDirection: "row" }}>
                <TitleAndText title={"Mais Sobre " + pet.animal.name}>
                  <Text>{pet.animal.story}</Text>
                </TitleAndText>
              </View>
              {dono && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                  <Button
                mode="contained"
                onPress={() => {
                  navigation.navigate('UserList', {
                    petId: route.params.petAndOwner.pet.id,
                  });
                }}
              >
                Ver Interessados
              </Button>
                  <Button mode="contained" style={{ flex: 1 }} onPress={() => PetRemove() } >
                    <Text>Remover Pet</Text>
                  </Button>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </>
    )
  } else {
    ; <View>
      <Text>Erro</Text>
    </View>
  }
}

const TitleAndText = ({ title, children, style }: TitleAndTextProps) => {
  const theme = useTheme()
  const styles = makeStyles(theme)
  return (
    <View style={[{ gap: 2, flex: 1 }, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    baseColor: {
      color: theme.colors.onBackground,
    },
    sectionTitle: {
      textTransform: "uppercase",
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: "bold",
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
  })
