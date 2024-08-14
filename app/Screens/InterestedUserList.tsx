import { FlatList, Text } from "react-native"
import React, { useContext, useEffect, useState } from "react"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { RootStackParamList } from "../Navigation/RootStack"
import { getInterestedUsersInPetAction } from "@/services/api/user/getInterestedUsersInPetAction"
import { GetUserActionReturn } from "@/services/api/user/getUserAction"
import { RefreshControl } from "react-native-gesture-handler"
import ListEmpty from "@/components/atoms/ListEmpty"
import UserCard from "@/components/molecules/UserCard"
import { Button } from "react-native-paper"
import getRoomWithUserAction from "@/services/api/chat/getRoomAction"
import checkRoomWithUserExists from "@/services/api/chat/checkRoomWithUserExists"

type Props = DrawerScreenProps<RootStackParamList, "UserList">

export default function InterestedUserList({ route, navigation }: Props) {
  const firebaseApp = useContext(FirebaseAppContext)
  const petId = route.params.petId

  const [interestedUsers, setInterestedUsers] = useState<
    (GetUserActionReturn & { roomExists: boolean })[]
  >([])
  const [refreshing, setRefreshing] = useState(true)

  useEffect(() => {
    callback().finally(() => {
      setRefreshing(false)
    })

    async function callback() {
      const uslst = await getInterestedUsersInPetAction(petId, firebaseApp)
      const newList: (GetUserActionReturn & { roomExists: boolean })[] =
        await Promise.all(
          uslst.map(async (usr) => {
            const b = await checkRoomWithUserExists(firebaseApp, usr.id)
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
          user={item}
          right={
            <Button
              mode="contained"
              compact
              onPress={async () => {
                const room = await getRoomWithUserAction(firebaseApp, item.id)
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
