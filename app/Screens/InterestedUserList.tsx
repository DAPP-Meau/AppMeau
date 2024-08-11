import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { Image } from "expo-image"
import React, { useContext, useEffect, useState } from "react"
import { MD3Theme, useTheme } from "react-native-paper"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { getAuth } from "firebase/auth"
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  documentId,
} from "firebase/firestore"
import { collections } from "@/constants"
import { UserRegistrationDocument } from "@/services/models"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { RootStackParamList } from "../Navigation/RootStack"

type Props = DrawerScreenProps<RootStackParamList, "UserList">

export default function InterestedUserList({ route, navigation }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const petId = route.params.petId
  const firebaseApp = useContext(FirebaseAppContext)
  const [users, setUsers] = useState<Array<UserRegistrationDocument & {id:string}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore(firebaseApp)
      const auth = getAuth(firebaseApp)
      const user = auth.currentUser
      const uid = user?.uid

      if (!uid) {
        Alert.alert("Usuário não autenticado.")
        return
      }
      console.log("petId = " + petId)
      //const interestedQuery = query(
      //  collection(db, collections.pets,petId),
      //where("id", "==", petId),
      //where("interested", "array-contains", uid)
      //)
      let interestedUserIds: string[] = []
      const interestedQuery = await getDocs(collection(db, collections.pets))
      interestedQuery.forEach((docpet) => {
        if (docpet.id == petId) {
          const interested = docpet.data().interested || []
          console.log(`${docpet.id} => ` + JSON.stringify(docpet.data()))
          console.log(`${docpet.id} => ` + interested)
          interestedUserIds = interested
        }
      })
      if (interestedUserIds.length === 0) {
        console.log("Nenhum usuário interessado encontrado.")
        return
      }
      console.log("passei2")
      try {
        const userQuery = query(
          collection(db, "users"),
          where(documentId(), "in", interestedUserIds),
        )
        const userSnapshot = await getDocs(userQuery)
        //userSnapshot.forEach((doc) => {console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);});
        const interestedUsers = userSnapshot.docs.map((doc) => ({
          ...doc.data(), id: doc.id
        }))
        console.log(interestedUsers)
        setUsers(interestedUsers as Array<UserRegistrationDocument & {id:string}>)
      } catch (error) {
        console.error("Erro ao buscar usuários interessados: ")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [petId, firebaseApp])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  const blurhash =
    "fSSh}iWVo~ofbxofX=WBaJj?nzj@rna#f6j?aef6vva}kCj@WYayV=ayaxj[ocfQ"

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Image
            style={styles.profileImage}
            source={item.person.picture_uid}
            placeholder={{ blurhash }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.person.fullName}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate("chat", {userID:item.id, petID:petId})
            }}
          >
            <Text style={styles.buttonText}>Entrar em contato</Text>
          </TouchableOpacity>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          Nenhum usuário interessado encontrado.
        </Text>
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
