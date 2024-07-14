import { StyleSheet, Text, View } from "react-native"
import React, { useContext } from "react"
import { Button } from "react-native-paper"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { getAuth } from "firebase/auth"
import { router } from "expo-router"

export default function Logout() {
  const firebaseapp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseapp)

  return (
    <Button mode="contained" onPress={async () => {
      await auth.signOut()
      router.navigate("/")
    }}>
      <Text>Sair</Text>
    </Button>
  )
}
