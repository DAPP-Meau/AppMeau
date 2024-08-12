import PetCard from "@/components/molecules/PetCard"
import { GetPetListActionReturn } from "@/models"
import { getPetListAction } from "@/services/api/pet/getPetListAction"
import { FirebaseAppContext } from "@/utils/store/firebaseAppContext"
import { useNavigation } from "@react-navigation/native"
import React, { useContext, useEffect, useState } from "react"
import { Alert, Text } from "react-native"
import { FlatList, RefreshControl } from "react-native-gesture-handler"
import { IconButton } from "react-native-paper"

export default function PetList() {
  const navigation = useNavigation()
  const firebaseApp = useContext(FirebaseAppContext)

  const [refreshing, setRefreshing] = useState(true)
  const [petList, setPetList] = useState<GetPetListActionReturn | undefined>(
    undefined,
  )
  
  // Pegar lista de pets do firebase
  useEffect(() => {
    getPetListAction(firebaseApp)
      .then((result) => {
        setPetList(result)
      })
      .finally(() => {
        setRefreshing(false)
      })
  }, [refreshing])

  // Adicionar botão de pesquisa no cabeçalho desta tela.
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <IconButton icon="magnify" onPress={onSearch} />, // Todo: filtro de pesquisa
    })
  }, [navigation])

  const onFavourite = () => {
    Alert.alert("Não implementado")
  }

  const onSearch = () => {
    Alert.alert("Não implementado")
  }

  return (
    <FlatList
      data={petList}
      renderItem={({ item }) => (
        <PetCard
          petAndOwner={item}
          key={item.pet.id}
          onFavourite={onFavourite}
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
