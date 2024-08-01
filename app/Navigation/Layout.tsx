import React from "react"
import Index from "../Screens/Index"
import Login from "../Screens/Login"
import UserRegistration from "../Screens/UserRegistration"
import Unauthorized from "../Screens/LoginError"
import { createStackNavigator } from "@react-navigation/stack"
import HomeDrawer from "./HomeDrawer"

export type LayoutParamList = {
  homeLayout: undefined
  index: undefined
  login: undefined
  userRegistration: undefined
  unauthorized: undefined
}

const Stack = createStackNavigator<LayoutParamList>()

export default function Layout() {
  return (
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen
        name="index"
        component={Index}
        options={{ headerShown: false, headerTitle: "Menu" }}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{ headerTitle: "Login" }}
      />
      <Stack.Screen
        name="userRegistration"
        component={UserRegistration}
        options={{ headerTitle: "Criar novo usuário" }}
      />
      <Stack.Screen
        name="unauthorized"
        component={Unauthorized}
        options={{ headerTitle: "Acesso não Autorizado" }}
      />
      <Stack.Screen
        name="homeLayout"
        component={HomeDrawer}
        options={{ headerShown: false, headerTitle: "Menu" }}
      />
    </Stack.Navigator>
  )
}
