import { FlatList, Text } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { RootStackParamList } from "../Navigation/RootStack"
import { getInterestedUsersInPetAction } from "@/services/api/user/getInterestedUsersInPetAction"
import { RefreshControl } from "react-native-gesture-handler"
import ListEmpty from "@/components/atoms/ListEmpty"
import UserCard from "@/components/molecules/UserCard"
import { Button } from "react-native-paper"
import getRoomWithUserAction from "@/services/api/chat/getRoomAction"
import checkRoomWithUserExists from "@/services/api/chat/checkRoomWithUserExists"
import { Snapshot, User } from "@/models"

type Props = DrawerScreenProps<RootStackParamList, "UserList">

export default function InterestedUserList({ route, navigation }: Props) {
  const firebaseApp = useContext(FirebaseAppContext)
  const petId = route.params.petId

  const [interestedUsers, setInterestedUsers] = useState<
    (Snapshot<User> & { roomExists: boolean })[]
  >([])
  const [refreshing, setRefreshing] = useState(true)

  useEffect(() => {
    callback().finally(() => {
      setRefreshing(false)
    })

    async function callback() {
      // Procurar usuários e ver se eles já tem chat
      const tempIntList = await getInterestedUsersInPetAction(
        petId,
        firebaseApp,
      )
      const newList: (Snapshot<User> & { roomExists: boolean })[] =
        await Promise.all(
          tempIntList.map(async (usr) => {
            const b = await checkRoomWithUserExists(usr.id, petId, firebaseApp)
            return { ...usr, roomExists: b }
          }),
        )
      setInterestedUsers(newList)
    }
  }, [refreshing, petId])

  return (
    <FlatList
      data={interestedUsers}
      renderItem={({ item }) => (
        <UserCard
          user={item.data}
          right={
            <Button
              mode="contained"
              compact
              onPress={async () => {
                const room = await getRoomWithUserAction(
                  item.id,
                  petId,
                  firebaseApp,
                )
                navigation.navigate("chat", { roomId: room.id })
              }}
            >
              <Text>
                {item.roomExists ? "Continuar conversa" : "Iniciar conversa"}
              </Text>
            </Button>
          }
        />
      )}
      ListEmptyComponent={() => (
        <ListEmpty
          loading={refreshing}
          message="Não tem ninguém interessado no seu pet"
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
