import { Text, View } from "react-native"
import React, { useContext } from "react"
import { Button } from "react-native-paper"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { getAuth } from "firebase/auth"
import { useNavigation } from "@react-navigation/native"

export default function Logout() {
  const navigation = useNavigation()
  const firebaseapp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseapp)

  return (
    <View style={{flex:1, justifyContent: "center", paddingHorizontal:48, gap:15}}>
      <Text>Deseja mesmo sair?</Text>
      <Button
        mode="contained"
        uppercase
        onPress={async () => {
          await auth.signOut()
          navigation.navigate("index")
        }}
      >
        Sair
      </Button>
    </View>
  )
}
