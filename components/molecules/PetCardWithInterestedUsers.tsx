import { RootStackParamList } from "@/app/Navigation/RootStack"
import { blurhash } from "@/constants/blurhash"
import { Pet, Snapshot, User } from "@/models"
import { getUserActionWId } from "@/services/api/user/getUserAction"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { usuariosInteressados } from "@/utils/strings"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { Image } from "expo-image"
import { useContext, useEffect, useState } from "react"
import React, { Alert, FlatList, Text, View } from "react-native"
import { Button, Card, Divider, useTheme } from "react-native-paper"
import UserCard from "./UserCard"
import { UserListRightButton } from "../atoms/UserListRightButton"
import checkRoomWithUserExists from "@/services/api/chat/checkRoomWithUserExists"
import ListEmpty from "../atoms/ListEmpty"
import { rejectAdoptionAction } from "@/services/api/pet/rejectAdoptionAction"
import getRoomWithUserAction from "@/services/api/chat/getRoomAction"
import sendAcceptMessage from "@/services/api/chat/sendAcceptMessage"
import getPetAction from "@/services/api/pet/getPetAction"
import { doc, getFirestore, updateDoc } from "firebase/firestore"
import { FirebaseApp } from "firebase/app"
import { collectionPaths } from "@/constants"

export interface IPetCardWithInterestedUsersProps {
  pet: Snapshot<Pet>
}

export default function PetCardWithInterestedUsers({
  pet,
}: IPetCardWithInterestedUsersProps) {
  const firebaseApp = useContext(FirebaseAppContext)
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const theme = useTheme()

  const { data: petData, id: petID } = pet

  const [interestedUsers, setInterestedUsers] = useState<
    (Snapshot<User> & { roomExists: boolean })[]
  >([])
  const [loading, setLoading] = useState(true)

  // Encontrar lista de usuários interessados no pet.
  useEffect(() => {
    const callback = async () => {
      const users = await Promise.all(
        petData.interestedUsersList?.map((uid) => {
          return getUserActionWId(uid, firebaseApp)
        }) ?? [],
      )
      const validUsers = users.filter((user): user is Snapshot<User> => {
        return user !== null && user !== undefined
      })
      const returnList = []
      for (const user of validUsers) {
        const b = await checkRoomWithUserExists(user.id, pet.id, firebaseApp)
        returnList.push({ ...user, roomExists: b })
      }
      return returnList
    }

    callback().then((users) => {
      setInterestedUsers(users)
      setLoading(false)
    })
  }, [pet, loading, firebaseApp])

  async function updatePetAdoptionStatus(
    petID: string,
    status: boolean,
    firebaseApp: FirebaseApp,
  ) {
    const db = getFirestore(firebaseApp)

    const petDocumentReference = doc(db, collectionPaths.pets, petID)

    await updateDoc(petDocumentReference, {
      adoptionRequest: status,
      adoption: false,
    })
  }

  const acceptDonation = async (userID: string): Promise<void> => {
    const room = await getRoomWithUserAction(userID, petID, firebaseApp)
    //verificar se ja foi enviado esse mensagem caso tenha sido é necessário verificar se teve resposta
    //do contrario não deve reenviar a mensagem
    //TODO:
    const pet = await getPetAction(petID, firebaseApp)
    //adicionar adoptionRequest no pet
    // undefined -> false
    if (pet?.adoptionRequest ?? false) {
      Alert.alert(
        "Você Já aceitou a doação, aguarde a resposta do outro usuário.",
      )
    } else {
      try {
        await sendAcceptMessage(room, firebaseApp)
        // Definir a solicitação de adoção como true no pet
        await updatePetAdoptionStatus(petID ?? "", true, firebaseApp)
        Alert.alert(
          "Você aceitou a doação.",
          "Espere a resposta do outro usuário.",
        )
      } catch (error) {
        console.error("Erro ao aceitar adoção:", error)
        Alert.alert("Erro", "Não foi possível aceitar a adoção.")
      }
    }
  }

  const rejectDonation = async (userID: string): Promise<void> => {
    await rejectAdoptionAction(petID, userID, firebaseApp)
    // TODO: adicionar um snackbar avisando do sucesso da operação
    Alert.alert(
      "O usuário foi removido da lista de interessados e não poderá ver e interessar o seu pet novamente.",
    )
    setLoading(true)
  }

  return (
    <Card
      onPress={() => {
        navigation.navigate("petDetails", { petID: petID })
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          backgroundColor: petData.adoption
            ? theme.colors.primaryContainer
            : theme.colors.errorContainer,
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
          {!petData.adoption && (
            <Text style={{ fontSize: 18 }}>Adoção desativada</Text>
          )}
          <Text>
            {usuariosInteressados(petData.interestedUsersList?.length ?? 0)}
          </Text>
        </View>
      </View>
      <FlatList
        data={interestedUsers}
        renderItem={({ item: user }) => (
          <>
            <UserCard
              user={user.data}
              key={user.id}
              right={
                <UserListRightButton
                  userID={user.id}
                  petID={petID}
                  chatExists={user.roomExists}
                  navigation={navigation}
                  firebaseApp={firebaseApp}
                />
              }
            />
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                justifyContent: "space-around",
              }}
            >
              <Button compact onPress={() => acceptDonation(user.id)}>
                <Text>Aceitar adoção</Text>
              </Button>
              <Button compact onPress={() => rejectDonation(user.id)}>
                <Text>Rejeitar adoção</Text>
              </Button>
            </View>
            <Divider />
          </>
        )}
        ListEmptyComponent={() => (
          <ListEmpty
            loading={loading}
            message="Ainda sem usuários interessados"
            hideEmptyMessage
          />
        )}
      />
    </Card>
  )
}
