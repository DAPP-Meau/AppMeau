import { Text, View } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { FlatList, RefreshControl } from "react-native-gesture-handler"
import ListEmpty from "@/components/atoms/ListEmpty"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import getCurrentUserUID from "@/utils/getCurrentUser"
import getUserRoomPetAction, {
  RoomUserAndPetDocument,
} from "@/services/api/chat/getUserRoomsAction"
import UserCard from "@/components/molecules/UserCard"
import { Button, Card, useTheme } from "react-native-paper"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../Navigation/RootStack"
import { useNavigation } from "@react-navigation/native"
import { Image } from "expo-image"
import { blurhash } from "@/constants/blurhash"

export default function OpenRooms() {
  const [openRoomsList, setOpenRoomsList] = useState<RoomUserAndPetDocument[]>()
  const [refreshing, setRefreshing] = useState(true)

  const firebaseApp = useContext(FirebaseAppContext)
  const loggedInUserUid = getCurrentUserUID(firebaseApp)

  // Pegar lista de salas do usuário logado no firebase
  useEffect(() => {
    async function fetchData() {
      if (!loggedInUserUid) return
      const userRooms = await getUserRoomPetAction(firebaseApp)
      setOpenRoomsList(userRooms)
    }

    fetchData().then(() => {
      setRefreshing(false)
    })
  }, [refreshing, loggedInUserUid])

  return (
    <FlatList
      data={openRoomsList}
      renderItem={({ item }) => <PetRoomsList roomUserPet={item} />}
      ListEmptyComponent={() => (
        <ListEmpty
          loading={refreshing}
          message="Parece que você não tem chats abertos..."
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => setRefreshing(true)}
        />
      }
    />
  )
}

interface IPetRoomListProps {
  roomUserPet: RoomUserAndPetDocument
}

export function PetRoomsList({ roomUserPet }: IPetRoomListProps) {
  const theme = useTheme()
  const rootStackNavigation =
    useNavigation<StackNavigationProp<RootStackParamList>>()

  const { petDocument, listOfRooms } = roomUserPet
  const { data: petData, id: petID } = petDocument

  return (
    <Card elevation={1} style={{ margin: 10 }}>
      <Card
        onPress={() => {
          rootStackNavigation.navigate("petDetails", { petID: petID })
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 5,
            alignItems: "center"
          }}
        >
          <Image
            style={{ height: 50, aspectRatio: 1, borderRadius: 5 }}
            source={petData.picture_url}
            placeholder={{ blurhash }}
            contentFit="scale-down"
            transition={1000}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: 18 }}>{petData.animal.name}</Text>
          </View>
        </View>
      </Card>

      <FlatList
        data={listOfRooms}
        style={{ margin: 10 }}
        renderItem={({ item }) => (
          <UserCard
            user={item.user.data}
            right={
              <Button
                mode="contained"
                compact
                onPress={() => {
                  rootStackNavigation.navigate("chat", { roomId: item.room.id })
                }}
              >
                <Text>Continuar conversa</Text>
              </Button>
            }
            key={item.room.id}
          />
        )}
        scrollEnabled={false}
      />
    </Card>
  )
}
