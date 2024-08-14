import { FlatList, Text } from "react-native"
import React, { useContext, useMemo, useState } from "react"
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

type Props = DrawerScreenProps<RootStackParamList, "UserList">

export default function InterestedUserList({ route, navigation }: Props) {
  const firebaseApp = useContext(FirebaseAppContext)
  const petId = route.params.petId

  const [interestedUsers, setInterestedUsers] = useState<GetUserActionReturn[]>(
    [],
  )
  const [refreshing, setRefreshing] = useState(true)

  useMemo(() => {
    getInterestedUsersInPetAction(petId, firebaseApp)
      .then((result) => {
        setInterestedUsers(result)
      })
      .finally(() => {
        setRefreshing(false)
      })
  }, [refreshing])

  return (
    <FlatList
      data={interestedUsers}
      renderItem={({ item: user }) => (
        <UserCard
          user={user}
          right={
            <Button
              mode="contained"
              compact
              onPress={() => {
                getRoomWithUserAction(firebaseApp, user.id)
                navigation.navigate("chat", { roomId: user.id })
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
