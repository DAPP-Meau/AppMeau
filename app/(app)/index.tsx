import { Text, View } from "react-native"
import React from "react"
import { Button } from "react-native-paper"
import { Link } from "expo-router"

export default function ListPets() {
  return (
    <View>
      <Text>listPets</Text>
      <Text>TODO!</Text>
      <Link push href="pets/TAokyfjX7ZLQhpdDQVYf" asChild>
        <Button mode="contained">
          <Text>Ver animal</Text>
        </Button>
      </Link>
      <Link push href="../petRegistration" asChild>
        <Button mode="contained">
          <Text>Adicionar animal</Text>
        </Button>
      </Link>
    </View>
  )
}
