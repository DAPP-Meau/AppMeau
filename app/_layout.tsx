import { Text } from "react-native";
import { Stack } from "expo-router/stack";
import { useFonts } from 'expo-font';
import { fonts } from "@/assets";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  let [fontsLoaded, error] = useFonts(fonts);

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
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>  
    </PaperProvider>
  );
}
