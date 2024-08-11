import { Text, View } from "react-native"
import React, { useContext } from "react"
import { Button } from "react-native-paper"
import { FirebaseAppContext } from "@/utils/store/firebaseAppContext"
import { getAuth } from "firebase/auth"
import { useNavigation } from "@react-navigation/native"
import { BlueColorScreen } from "@/utils/store/ScreenColorScheme"
import { LayoutParamList } from "../Navigation/Layout"
import { StackNavigationProp } from "@react-navigation/stack"

export default function Logout() {
  const navigation = useNavigation<StackNavigationProp<LayoutParamList>>()
  const firebaseapp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseapp)

  return (
    <>
      <BlueColorScreen />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 48,
          gap: 15,
        }}
      >
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
    </>
  )
}
