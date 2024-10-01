import React, { useContext } from "react"
import Index from "../Screens/Index"
import Login from "../Screens/Login"
import UserRegistration from "../Screens/UserRegistration"
import Unauthorized from "../Screens/LoginError"
import { createStackNavigator } from "@react-navigation/stack"
import RootStack from "./RootStack"
import CustomStackHeaderBar from "@/components/organisms/CustomStackHeaderBar"
import { LoggedInUserContext } from "@/services/store/LoggedInUserContext"

export type LayoutParamList = {
  index: undefined
  login: undefined
  userRegistration: undefined
  unauthorized: undefined
  rootStack: undefined
}

const Stack = createStackNavigator<LayoutParamList>()

export default function Layout() {
  const user = useContext(LoggedInUserContext)
  return (
    <Stack.Navigator
      initialRouteName="index"
      screenOptions={{ header: (props) => <CustomStackHeaderBar {...props} /> }}
    >
      {user ? (
        <Stack.Group>
          <Stack.Screen
            name="rootStack"
            component={RootStack}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="index"
            component={Index}
            options={{ headerShown: false }}
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
        </Stack.Group>
      )}
    </Stack.Navigator>
  )
}
