import { Text, View } from "react-native"
import React, { useMemo, useState } from "react"
import { Button } from "react-native-paper"
import { Link } from "expo-router"
import { PetRegistrationDocument } from "@/services/models"
import RenderPetsList from "@/components/elements/RenderPetsList"

export default function ListPets() {
  const [pets, setPets] = useState<Array<PetRegistrationDocument>>([])

  return (
    <View>
      <Text>listPets</Text>
      <Text>TODO!</Text>

      <Link push href="CardPets/TAokyfjX7ZLQhpdDQVYf" asChild>
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
