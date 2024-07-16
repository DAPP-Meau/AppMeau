import { Text, View } from "react-native"
import React, { useMemo, useState } from "react"
import { Button } from "react-native-paper"
import { Link } from "expo-router"
import { PetRegistrationDocument } from "@/services/models"

export default function ListPets() {
  const [pets, setPets] = useState<Array<PetRegistrationDocument>>([])

  useMemo(() => {listPetsAction()}, [])

  return (
    <View>
      <Text>listPets</Text>
      <View>
        <RenderPetsList pets={pets} />
      </View>
      <Link push href="/(app)/petRegistration" asChild>
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
