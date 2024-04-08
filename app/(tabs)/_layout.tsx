import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: Colors.tintLight.yellow1 }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tela Inicial",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="play" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
