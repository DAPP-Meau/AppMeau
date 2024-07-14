import { fonts } from "@/assets"
import FirebaseAppProvider from "@/components/FirebaseAppProvider"
import { lightModeYellowTheme } from "@/constants"
import { useFonts } from "expo-font"
import { SplashScreen, Stack } from "expo-router"
import React, { useEffect } from "react"
import { PaperProvider } from "react-native-paper"

SplashScreen.preventAutoHideAsync()

export default function AppLayout() {
  const [fontsLoaded, error] = useFonts(fonts)

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <PaperProvider theme={lightModeYellowTheme}>
      <FirebaseAppProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              presentation: "modal",
              headerTitle: "Login"
            }}
          />
          <Stack.Screen
            name="userRegistration"
            options={{
              presentation: "modal",
              headerTitle: "Cadastro"
            }}
          />
          <Stack.Screen
            name="erroLogin"
            options={{
              presentation: "modal",
              headerTitle: "Erro"
            }}
          />
          <Stack.Screen
            name="(app)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </FirebaseAppProvider>
    </PaperProvider>
  )
}
