import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Index from "./Index"
import Login from "./Login"
import UserRegistration from "./UserRegistration"
import Unauthorized from "./LoginError"
import { createStackNavigator } from '@react-navigation/stack';

type LayoutStackParamList = {
  index: undefined,
  login: undefined,
  userRegistration: undefined,
  unauthorized: undefined,
}

const Stack = createStackNavigator<LayoutStackParamList>();

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
    </Stack.Navigator>
  )
}
