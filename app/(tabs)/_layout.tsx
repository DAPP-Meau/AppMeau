import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from 'expo-router/drawer';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Tela Inicial",
            headerTitleStyle: {color:"transparent"},
            headerStyle: { backgroundColor: Colors.background.default },
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
          name="createLogin"
          options={{
            title: "Cadastrar Pessoal",
            headerStyle: { backgroundColor: Colors.tintLight.blue2 },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
