import { Stack } from "expo-router/stack";
import { useFonts } from 'expo-font';
import { fonts } from "@/assets";
import { SplashScreen } from "expo-router";
import React, { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const [fontsLoaded, error] = useFonts(fonts);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
