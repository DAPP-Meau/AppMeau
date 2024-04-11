import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";
import Colors from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Tela Inicial",
            title: "",
            headerTitleStyle: {fontFamily:'Roboto_Medium'},
            headerStyle: { backgroundColor: Colors.background.default},
          }}
        />
        <Drawer.Screen
          name="login"
          options={{
            title: "Login",
            headerTitleStyle: {fontFamily:'Roboto_Medium'},
            headerStyle: { backgroundColor: Colors.tintLight.blue2 },
          }}
        />
        <Drawer.Screen
          name="createLogin"
          options={{
            title: "Cadastrar Pessoal",
            headerTitleStyle: {fontFamily:'Roboto_Medium'},
            headerStyle: { backgroundColor: Colors.tintLight.blue2 },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
