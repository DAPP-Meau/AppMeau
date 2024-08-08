import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import HomeDrawer from "./HomeDrawer"
import PetDetails from "../Screens/PetDetails"
import PetRegistrationSuccess from "../Screens/PetRegistrationSuccess"
import { PetAndOwnerDocument } from "@/services/actions"
import CustomStackHeaderBar from "@/components/elements/display/CustomStackHeaderBar"
import UserList from "../Screens/UserList"

export type RootStackParamList = {
  homeDrawer: undefined
  addPetsSuccess: undefined
  petDetails: { petAndOwner: PetAndOwnerDocument }
}

const Stack = createStackNavigator<RootStackParamList>()

export default function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{ header: (props) => <CustomStackHeaderBar {...props} /> }}
    >
      <Stack.Screen
        name="homeDrawer"
        component={HomeDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="addPetsSuccess"
          options={{
            title: "Sucesso!",
          }}
          component={PetRegistrationSuccess}
        />
        <Stack.Screen
          name="petDetails"
          component={PetDetails}
          options={{
            title: "Detalhes do pet",
          }}
        />
        <Stack.Screen name="UserList" component={UserList} />
      </Stack.Group>
    </Stack.Navigator>
  )
}
