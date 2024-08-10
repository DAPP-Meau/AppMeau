import PetCard from "@/components/elements/PetCard"
import { getPetListAction, GetPetListActionReturn } from "@/services/actions/"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { useNavigation } from "@react-navigation/native"
import React, { useContext, useEffect, useState } from "react"
import { Text } from "react-native"
import { FlatList, RefreshControl } from "react-native-gesture-handler"
import { IconButton } from "react-native-paper"

export default function PetList() {
  //pegar todos os IDS do cloud e passar todos aqui
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = useState(true)
  const [petList, setPetList] = useState<GetPetListActionReturn>()
  const firebaseApp = useContext(FirebaseAppContext)

  useEffect(() => {
    getPetListAction(firebaseApp).then((result) => {
      setPetList(result)
      setRefreshing(false)
    })
  }, [refreshing])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconButton icon="magnify" onPress={() => {}} />, // Todo: filtro de pesquisa
    })
  }, [navigation])

  return (
    <FlatList
      data={petList}
      renderItem={({ item }) => (
        <PetCard
          petAndOwner={item}
          onRefresh={() => {
            setRefreshing(true)
          }}
        />
      )}
      ListEmptyComponent={() => {
        return refreshing ? null : <Text>Nadinha!</Text>
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
          }}
        />
      }
    />
  )
}
