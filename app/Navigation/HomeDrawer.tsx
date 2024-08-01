import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import PetList from "../Screens/PetList"
import PetRegistration from "../Screens/PetRegistration"
import PetRegistrationSuccess from "../Screens/PetRegistrationSuccess"
import Logout from "../Screens/Logout"
import PetDetails from "../Screens/PetDetails"

export type HomeDrawerParamList = {
  petList: undefined
  addPets: undefined
  addPetsSuccess: undefined
  petDetails: { petId: string }
  logout: undefined
}

const Drawer = createDrawerNavigator<HomeDrawerParamList>()

export default function HomeDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleStyle: { fontFamily: "Roboto_Medium" },
      }}
      initialRouteName="petList"
    >
      <Drawer.Group>
        <Drawer.Screen
          name="petList"
          options={{
            drawerLabel: "Adotar um pet",
            title: "Adotar um pet",
          }}
          component={PetList}
        />
        <Drawer.Screen
          name="addPets"
          options={{
            drawerLabel: "Adicionar seu pet",
            title: "Adicione seu pet",
          }}
          component={PetRegistration}
        />
        <Drawer.Screen
          name="logout"
          options={{
            drawerLabel: "Sair",
            title: "Sair",
          }}
          component={Logout}
        />
        <Drawer.Screen
          name="addPetsSuccess"
          options={{
            drawerLabel: "Sucesso!",
            title: "Sucesso!",
            drawerItemStyle: { display: "none" },
          }}
          component={PetRegistrationSuccess}
        />
        <Drawer.Screen
          name="petDetails"
          component={PetDetails}
          options={{
            title: "Detalhes do pet",
            drawerItemStyle: { display: "none" },
            unmountOnBlur: true
          }}
        />
      </Drawer.Group>
    </Drawer.Navigator>
  )
}
