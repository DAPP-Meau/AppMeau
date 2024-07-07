import { Stack } from "expo-router/stack";
import { useFonts } from 'expo-font';
import { fonts } from "@/assets";
import { SplashScreen } from "expo-router";
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { lightModeYellowTheme } from "@/constants";
import FirebaseAppProvider from "@/components/FirebaseAppProvider";

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
    <PaperProvider theme={lightModeYellowTheme}>
      <FirebaseAppProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </FirebaseAppProvider>
    </PaperProvider>
  );
}
