import PetCard from "@/components/elements/PetCard"
import { getPetListAction, GetPetListActionReturn } from "@/services/actions/"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import React, { useContext, useMemo, useState } from "react"
import { Text, View } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import { ActivityIndicator } from "react-native-paper"

export default function PetList() {
  //pegar todos os IDS do cloud e passar todos aqui
  const [loading, setLoading] = useState(true)
  const [petList, setPetList] = useState<GetPetListActionReturn>()
  const firebaseApp = useContext(FirebaseAppContext)

  useMemo(() => {
    setLoading(true)
    getPetListAction(firebaseApp).then((result) => {
      setPetList(result)
      setLoading(false)
    })
  }, [])

  // TODO: Tela de carregamento.

  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={petList}
          renderItem={({ item }) => (
            <PetCard
              key={item.pet.id}
              address={item.user.data.address}
              pet={item.pet.data}
              id={item.pet.id}
            />
          )}
          ListEmptyComponent={<Text>Não há pets aqui!</Text>}
        />
      )}
    </View>
  )
}
