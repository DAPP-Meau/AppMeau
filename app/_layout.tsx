import { Text } from "react-native";
import { Stack } from "expo-router/stack";
import { useFonts } from 'expo-font';
import { fonts } from "@/assets";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import { lightThemeColors } from "@/constants";

SplashScreen.preventAutoHideAsync();

const theme: ThemeProp = {
  ...DefaultTheme,
  colors: lightThemeColors.colors,
  roundness: 1
}

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
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>  
    </PaperProvider>
  );
}
