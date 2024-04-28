import React from "react";
import Colors from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Drawer
        screenOptions={{
          headerTitleStyle: { fontFamily: "Roboto_Medium" },
          headerStyle: { backgroundColor: Colors.background.default },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Tela Inicial",
            title: "",
          }}
        />
        <Drawer.Screen
          name="login"
          options={{
            title: "Login",
            headerStyle: { backgroundColor: Colors.tintLight.blue2 },
          }}
        />
        <Drawer.Screen
          name="userRegistration"
          options={{
            title: "Cadastrar Usuário",
            headerStyle: { backgroundColor: Colors.tintLight.blue2 },
          }}
        />
        <Drawer.Screen
          name="animalRegistration"
          options={{
            title: "Cadastrar Animal",
            headerStyle: { backgroundColor: Colors.tintLight.yellow2 },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
