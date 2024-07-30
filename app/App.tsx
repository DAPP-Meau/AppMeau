import "@/services/gesture-handler" // Esse deve vir antes de todos os outros.
import { fonts } from "@/assets"
import FirebaseAppProvider from "@/components/FirebaseAppProvider"
import { lightModeBlueTheme, lightModeYellowTheme } from "@/constants"
import { useFonts } from "expo-font"
import { SplashScreen } from "expo-router"
import React, { useEffect } from "react"
import { PaperProvider } from "react-native-paper"
import Layout from "./Layout"
import { NavigationContainer } from "@react-navigation/native"
import { registerRootComponent } from "expo"
import { SafeAreaProvider } from "react-native-safe-area-context"

export function App() {
  const [loaded, error] = useFonts(fonts)

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return (
    <PaperProvider theme={lightModeYellowTheme}>
      <NavigationContainer>
        <FirebaseAppProvider>
          <SafeAreaProvider>
            <Layout />
          </SafeAreaProvider>
        </FirebaseAppProvider>
      </NavigationContainer>
    </PaperProvider>
  )
}

export default registerRootComponent(App)
