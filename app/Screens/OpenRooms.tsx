import { GestureResponderEvent, Text } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native-gesture-handler"
import { RoomDocument } from "@/models"
import ListEmpty from "@/components/atoms/ListEmpty"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import getCurrentUserUID from "@/utils/getCurrentUser"
import getUserRoomsAction, {
  GetUserRoomsActionReturn,
} from "@/services/api/chat/getUserRoomsAction"
import UserCard from "@/components/molecules/UserCard"
import { Button } from "react-native-paper"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../Navigation/RootStack"
import { useNavigation } from "@react-navigation/native"

export default function OpenRooms() {
  const rootStackNavigation =
    useNavigation<StackNavigationProp<RootStackParamList>>()
  const [openRoomsList, setOpenRoomsList] = useState<GetUserRoomsActionReturn>()
  const [refreshing, setRefreshing] = useState(true)

  const firebaseApp = useContext(FirebaseAppContext)
  const loggedInUserUid = getCurrentUserUID(firebaseApp)

  // Pegar lista de salas do usuário logado no firebase
  useEffect(() => {
    async function fetchData() {
      if (!loggedInUserUid) return
      const userRooms = await getUserRoomsAction(firebaseApp)
      setOpenRoomsList(userRooms)
    }
    
    fetchData().then(() => {
      setRefreshing(false)
    })
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
                rootStackNavigation.navigate("chat", { roomId: item.room.id })
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
