import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Image } from "expo-image"
import React, { useContext, useMemo, useState } from "react"
import { MD3Theme, useTheme } from "react-native-paper"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { RootStackParamList } from "../Navigation/RootStack"
import { blurhash } from "@/constants/blurhash"
import { getInterestedUsersInPetAction } from "@/services/api/user/getInterestedUsersInPetAction"
import { GetUserActionReturn } from "@/services/api/user/getUserAction"
import { RefreshControl } from "react-native-gesture-handler"
import ListEmpty from "@/components/atoms/ListEmpty"

type Props = DrawerScreenProps<RootStackParamList, "UserList">

export default function InterestedUserList({ route, navigation }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const firebaseApp = useContext(FirebaseAppContext)
  const petId = route.params.petId

  const [interestedUsers, setInterestedUsers] = useState<GetUserActionReturn[]>(
    [],
  )
  const [refreshing, setRefreshing] = useState(true)

  useMemo(() => {
    getInterestedUsersInPetAction(petId, firebaseApp)
      .then((result) => {
        console.info({result: result})
        setInterestedUsers(result)
      })
      .finally(() => {
        setRefreshing(false)
      })
  }, [refreshing])

  return (
    <FlatList
      data={interestedUsers}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image
            style={styles.profileImage}
            source={item.data.person.pictureURL}
            placeholder={{ blurhash }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.data.person.fullName}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("chat", { userID: item.id, petID: petId })
            }}
          >
            <Text style={styles.buttonText}>Entrar em contato</Text>
          </TouchableOpacity>
        </View>
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

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.backdrop,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontWeight: "bold",
      fontSize: 16,
    },

    button: {
      padding: 12,
      backgroundColor: theme.colors.primary,
      borderRadius: 4,
    },
    buttonText: {
      color: "#fff",
      textAlign: "center",
    },
    emptyText: {
      textAlign: "center",
      margin: 16,
    },
  })
