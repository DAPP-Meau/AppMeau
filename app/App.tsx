import "@/utils/gesture-handler" // Esse deve vir antes de todos os outros.
import { fonts } from "@/assets"
import FirebaseAppProvider from "@/utils/store/FirebaseAppProvider"
import { lightModeBlueTheme, lightModeYellowTheme } from "@/constants"
import { useFonts } from "expo-font"
import { SplashScreen } from "expo-router"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { adaptNavigationTheme, PaperProvider } from "react-native-paper"
import Layout from "./Navigation/Layout"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { registerRootComponent } from "expo"
import { SafeAreaProvider } from "react-native-safe-area-context"
import {
  ColorSchemeContextProps,
  ColorSchemes,
} from "@/utils/store/ColorSchemeContext"
import ColorSchemeProvider from "@/utils/store/ColorSchemeProvider"
import { Image, StatusBar, View } from "react-native"
import merge from "deepmerge"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const { LightTheme: LightYellowNavTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  materialLight: lightModeYellowTheme,
})

const { LightTheme: LightBlueNavTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
  materialLight: lightModeBlueTheme,
})

const lightYellowTheme = merge(lightModeYellowTheme, LightYellowNavTheme)
const LightBlueTheme = merge(lightModeBlueTheme, LightBlueNavTheme)

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
      theme = LightBlueTheme
      break
    case "yellow":
    default:
      theme = lightYellowTheme
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
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors?.primary,
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Image
          style={{
            flex: 1,
            width: "50%",
            alignItems: "center",
            justifyContent: "flex-start",
            resizeMode: "contain",
          }}
          source={require("@/assets/images/Meau_marca.png")}
        />
      </View>
    )
  } else {
    return (
      <ColorSchemeProvider value={colorSchemeProviderValue}>
        <GestureHandlerRootView>
          <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
              <FirebaseAppProvider>
                <SafeAreaProvider>
                  <StatusBar backgroundColor={theme.colors?.primary} />
                  <Layout />
                </SafeAreaProvider>
              </FirebaseAppProvider>
            </NavigationContainer>
          </PaperProvider>
        </GestureHandlerRootView>
      </ColorSchemeProvider>
    )
  }
}

export default registerRootComponent(App)
