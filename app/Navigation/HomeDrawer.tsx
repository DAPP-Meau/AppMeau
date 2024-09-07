import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import PetList from "../Screens/PetList"
import PetRegistration from "../Screens/PetRegistration"
import Logout from "../Screens/Logout"
import CustomDrawerHeaderBar from "@/components/organisms/CustomDrawerHeaderBar"
import UserPetList from "../Screens/UserPetList"
import OpenRooms from "../Screens/OpenRooms"
import CustomDrawerContent from "@/components/organisms/CustomDrawerContent"
import Profile from "../Screens/Profile"

export type HomeDrawerParamList = {
  petList: undefined
  addPets: undefined
  logout: undefined
  userPetList: undefined
  openRooms: undefined
  profile: undefined
}

const Drawer = createDrawerNavigator<HomeDrawerParamList>()

export default function HomeDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={({ navigation, state, descriptors }) => (
        <CustomDrawerContent
          navigation={navigation}
          state={state}
          descriptors={descriptors}
        />
      )}
      screenOptions={{
        headerTitleStyle: { fontFamily: "Roboto_Medium" },
        header: (props) => <CustomDrawerHeaderBar {...props} />,
      }}
      initialRouteName="petList"
    >
      <Drawer.Screen
        name="profile"
        options={{ title: "Meu Perfil" }}
        component={Profile}
      />
      <Drawer.Group>
        <Drawer.Screen
          name="petList"
          component={PetList}
          options={{ title: "Adotar um pet" }}
        />
        <Drawer.Screen
          name="addPets"
          component={PetRegistration}
          options={{ title: "Registrar seu pet" }}
        />
        <Drawer.Screen
          name="userPetList"
          component={UserPetList}
          options={{ title: "Meus Pets" }}
        />
      </Drawer.Group>
      <Drawer.Screen
        name="openRooms"
        component={OpenRooms}
        options={{ title: "Conversas" }}
      />
      <Drawer.Screen
        name="logout"
        component={Logout}
        options={{ title: "Sair" }}
      />
    </Drawer.Navigator>
  )
}
