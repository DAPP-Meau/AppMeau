import { GestureResponderEvent, Text } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native-gesture-handler"
import { RoomDocument, UserDocument } from "@/models"
import ListEmpty from "@/components/atoms/ListEmpty"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import getCurrentUserUID from "@/utils/getCurrentUser"
import getUserRoomsAction from "@/services/api/chat/getUserRoomsAction"
import UserCard from "@/components/molecules/UserCard"
import getUserAction from "@/services/api/user/getUserAction"
import { Button } from "react-native-paper"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../Navigation/RootStack"
import { useNavigation } from "@react-navigation/native"

type UserRoomData = {
  roomId: string
  user: { id: string; data: UserDocument }
}[]

export default function OpenRooms() {
  const rootStackNavigation =
    useNavigation<StackNavigationProp<RootStackParamList>>()
  const [openRoomsList, setOpenRoomsList] = useState<UserRoomData>()
  const [refreshing, setRefreshing] = useState(true)

  const firebaseApp = useContext(FirebaseAppContext)
  const loggedInUserUid = getCurrentUserUID(firebaseApp)

  // Pegar lista de salas do usuário logado no firebase
  useEffect(() => {
    fetchData().then(() => {
      setRefreshing(false)
    })

    async function fetchData() {
      if (!loggedInUserUid) return
      const openRoom: UserRoomData = []
      const userRooms = await getUserRoomsAction(firebaseApp)
      for (const roomDocument of userRooms) {
        // pegar o id outro usuário da sala.
        // É impossível ter uma lista com menos de 2 ids por conta da validação
        // de schema dos rooms, mas deixei a mensagem para caso venha a
        // existir algum chat de usuário com ele mesmo.
        const userUID = roomDocument.data.users
          .filter((val) => {
            // tirar o próprio usuário
            return val !== loggedInUserUid
          })
          .at(0)
        if (!userUID) {
          console.warn("Lista de usuários da sala vazia.")
          continue
        }
        const userDocument = await getUserAction(userUID, firebaseApp)
        if (!userDocument) continue
        //Adicionar a lista se tudo estiver certo.
        openRoom.push({
          roomId: roomDocument.id,
          user: userDocument,
        })
      }
      setOpenRoomsList(openRoom)
    }
  }, [refreshing, loggedInUserUid])

  return (
    <FlatList
      data={openRoomsList}
      renderItem={({ item }) => (
        <UserCard
          user={item.user}
          right={
            <Button
              mode="contained"
              compact
              onPress={() => {
                rootStackNavigation.navigate("chat", { roomId: item.roomId })
              }}
            >
              <Text>Entrar em contato</Text>
            </Button>
          }
        />
      )}
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

interface IRoomCardProps {
  room: RoomDocument
  onPress: (e: GestureResponderEvent) => void
}

export function RoomCard({ room }: IRoomCardProps) {
  return (
    <TouchableOpacity>
      <Text>{room.users}</Text>
    </TouchableOpacity>
  )
}
