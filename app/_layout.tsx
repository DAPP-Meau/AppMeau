import { useFonts } from "expo-font"
import { fonts } from "@/assets"
import { SplashScreen } from "expo-router"
import { Drawer } from "expo-router/drawer";
import React, { useEffect } from "react"
import { PaperProvider } from "react-native-paper"
import { lightModeYellowTheme } from "@/constants"
import FirebaseAppProvider from "@/components/FirebaseAppProvider"
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";

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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            screenOptions={{
              headerTitleStyle: { fontFamily: "Roboto_Medium" },
              headerStyle: { backgroundColor: Colors.background.default },
            }}
          >
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: "Tela Inicial",
                title: "",
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </FirebaseAppProvider>
    </PaperProvider>
  )
}
