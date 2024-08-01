import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import HomeDrawer from "./HomeDrawer"
import PetDetails from "../Screens/PetDetails"

export type RootStackParamList = {
  home: undefined
  petDetails: { petId: string }
}

const Stack = createStackNavigator<RootStackParamList>()

export default function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={HomeDrawer} />
      <Stack.Screen
        name="petDetails"
        component={PetDetails}
        options={{
          title: "Detalhes do pet",
        }}
      />
    </Stack.Navigator>
  )
}
