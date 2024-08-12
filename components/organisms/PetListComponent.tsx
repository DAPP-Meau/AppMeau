import PetCard from "@/components/molecules/PetCard"
import { GetPetListActionReturn } from "@/models"
import { getPetListAction } from "@/services/api/pet/getPetListAction"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { useNavigation } from "@react-navigation/native"
import { QueryConstraint } from "firebase/firestore"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { Alert, Text } from "react-native"
import { FlatList, RefreshControl } from "react-native-gesture-handler"
import { ActivityIndicator, IconButton } from "react-native-paper"

export interface IPetListProps {
  query?: QueryConstraint[]
}

export default function PetListComponent({ query }: IPetListProps) {
  const navigation = useNavigation()
  const firebaseApp = useContext(FirebaseAppContext)

  const [refreshing, setRefreshing] = useState(true)
  const [petList, setPetList] = useState<GetPetListActionReturn | undefined>(
    undefined,
  )

  // Pegar lista de pets do firebase
  useMemo(() => {
    getPetListAction(firebaseApp, ...(query ?? []))
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
      headerRight: () => <IconButton icon="magnify" onPress={onSearch} />
    })
  }, [navigation])

  const onFavourite = () => { // TODO: botão de favorito
    Alert.alert("Não implementado")
  }

  const onSearch = () => { // TODO: filtro de pesquisa
    Alert.alert("Não implementado")
  }

  return (
    <>
      <FlatList
        data={petList}
        renderItem={({ item }) => (
          <PetCard
            petAndOwner={item}
            key={item.pet.id}
            onFavourite={onFavourite}
          />
        )}
        ListEmptyComponent={() => <ListEmpty loading={refreshing} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      />
    </>
  )
}

function ListEmpty({ loading }: { loading: boolean }) {
  if (loading) return <ActivityIndicator />
  else return <Text>Nadinha!</Text>
}
