import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { Redirect } from "expo-router"
import { Drawer } from "expo-router/drawer"
import { getAuth } from "firebase/auth"
import React, { useContext } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function TabLayout() {
  const firebaseApp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseApp)

  // Caso o usuário não esteja logado, ele é redirecionado para erroLogin.
  if (auth.currentUser) {
    return (defaultScreen())
  } else {
    return <Redirect href="/erroLogin" />
  }
}

function defaultScreen() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer
        screenOptions={{
          headerTitleStyle: { fontFamily: "Roboto_Medium" },
        }}
        initialRouteName="listPets"
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Listar pets",
            title: "Adotar um pet",
          }}
        />
        <Drawer.Screen
          name="petRegistration"
          options={{
            drawerLabel: "Registrar Pet",
            title: "Cadastrar um Pet",
          }}
        />
        <Drawer.Screen
          name="petRegistrationSuccess"
          options={{
            drawerItemStyle : {display: 'none'}
          }}
        />
        <Drawer.Screen
          name="logout"
          options={{
            drawerLabel: "Sair",
            title: "Sair",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}