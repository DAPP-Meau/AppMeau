import { Text, View } from "react-native"
import React from "react"
import { Button } from "react-native-paper"
import { Link } from "expo-router"

export default function ListPets() {
  return (
    <View>
      <Text>listPets</Text>
      <Text>TODO!</Text>
      <Link push href="/(app)/petRegistration" asChild>
        <Button mode="contained">
          <Text>Adicionar animal</Text>
        </Button>
      </Link>
    </View>
  )
}
