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
import React, { FlatList, Text, View } from "react-native"
import { Button, Card, Divider, useTheme } from "react-native-paper"
import UserCard from "./UserCard"
import { UserListRightButton } from "../atoms/UserListRightButton"
import checkRoomWithUserExists from "@/services/api/chat/checkRoomWithUserExists"
import ListEmpty from "../atoms/ListEmpty"

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

  const acceptDonation = () => {}
  const rejectDonation = () => {}

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
          backgroundColor: theme.colors.primaryContainer,
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
                justifyContent: "space-around"
              }}
            >
              <Button compact onPress={acceptDonation}>
                <Text>Aceitar adoção</Text>
              </Button>
              <Button compact onPress={rejectDonation}>
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
