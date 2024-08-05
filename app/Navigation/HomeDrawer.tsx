import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import PetList from "../Screens/PetList"
import PetRegistration from "../Screens/PetRegistration"
import Logout from "../Screens/Logout"
import CustomDrawerHeaderBar from "@/components/elements/display/CustomDrawerHeaderBar"
import UserPetList from "../Screens/UserPetList"

export type HomeDrawerParamList = {
  petList: undefined
  addPets: undefined
  logout: undefined  
  userPetList: undefined
}

const Drawer = createDrawerNavigator<HomeDrawerParamList>()

export default function HomeDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerTitleStyle: { fontFamily: "Roboto_Medium" },
        header: (props) => <CustomDrawerHeaderBar {...props} />
      }}
      initialRouteName="petList"
    >
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
          drawerLabel: "Registrar seu pet",
          title: "Registrar seu pet",
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
      name="userPetList"
      options={{
        drawerLabel: "Mesu Pets",
        title: "Mesu Pets",
      }}
      component={UserPetList}
      >        
      </Drawer.Screen>
    </Drawer.Navigator>
  )
}
