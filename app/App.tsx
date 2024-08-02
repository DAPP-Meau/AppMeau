import "@/services/gesture-handler" // Esse deve vir antes de todos os outros.
import { fonts } from "@/assets"
import FirebaseAppProvider from "@/components/FirebaseAppProvider"
import { lightModeBlueTheme, lightModeYellowTheme } from "@/constants"
import { useFonts } from "expo-font"
import { SplashScreen } from "expo-router"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { PaperProvider } from "react-native-paper"
import Layout from "./Navigation/Layout"
import { NavigationContainer } from "@react-navigation/native"
import { registerRootComponent } from "expo"
import { SafeAreaProvider } from "react-native-safe-area-context"
import {
  ColorSchemeContextProps,
  ColorSchemes,
} from "@/services/ColorSchemeContext"
import ColorSchemeProvider from "@/components/ColorSchemeProvider"
import { StatusBar } from "react-native"

export function App() {
  // Esperar carregar fontes
  const [loaded, error] = useFonts(fonts)
  const [colorSchemeState, setColorSchemeState] =
    useState<ColorSchemes>("yellow")

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  // Controle de Tema
  let theme = undefined
  switch (colorSchemeState) {
    case "blue":
      theme = lightModeBlueTheme
      break
    case "yellow":
    default:
      theme = lightModeYellowTheme
      break
  }

  const changeTheme = useCallback(
    (colorScheme: ColorSchemes) => {
      return setColorSchemeState(colorScheme)
    },
    [colorSchemeState],
  )

  const colorSchemeProviderValue: ColorSchemeContextProps = useMemo(
    () => ({
      colorScheme: colorSchemeState,
      setColorScheme: changeTheme,
    }),
    [changeTheme, colorSchemeState],
  )

  if (!loaded && !error) {
    return null
  } else {
    return (
      <ColorSchemeProvider value={colorSchemeProviderValue}>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <FirebaseAppProvider>
              <SafeAreaProvider>
                <StatusBar backgroundColor={theme.colors?.primary} />
                <Layout />
              </SafeAreaProvider>
            </FirebaseAppProvider>
          </NavigationContainer>
        </PaperProvider>
      </ColorSchemeProvider>
    )
  }
}

export default registerRootComponent(App)
