import { StyleSheet,  View } from 'react-native'
import React from 'react'
import { PetRegistrationDocument } from '@/services/models'
import PetCard from './PetCard'

interface IRenderPetsListProp{
  petList: Array<PetRegistrationDocument>
}

export default function RenderPetsList({petList}:IRenderPetsListProp) {
  return (
    <View>
      {petList.map((pet) => {
        <PetCard pet={pet}/>
      })}
    </View>
  )
}

const styles = StyleSheet.create({})