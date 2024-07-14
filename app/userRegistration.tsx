import CreateUserForm from "@/components/completedForms/CreateUserForm"
import { lightModeBlueTheme } from "@/constants"
import Colors from "@/constants/Colors"
import { createUserAction } from "@/services/actions/createUserAction"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { Link, router } from "expo-router"
import { useContext } from "react"
import React, { Animated, StatusBar, StyleSheet, Text } from "react-native"
import { Button, PaperProvider } from "react-native-paper"
import ScrollView = Animated.ScrollView

export default function userRegistration() {
  const firebaseApp = useContext(FirebaseAppContext)
  const isPresented = router.canGoBack()

  return (
    <PaperProvider theme={lightModeBlueTheme}>
      {/* Apresentar botão de cancelar caso essa tela apareça fora de uma pilha
      de navegação */}
      {!isPresented && (
        <Link href="../" asChild>
          <Button mode="contained">
            <Text>Cancelar</Text>
          </Button>
        </Link>
      )}
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar backgroundColor={Colors.tintLight.blue1} />
        <CreateUserForm
          onSubmit={async (fields, form) => {
            await createUserAction(fields, form, firebaseApp)
          }}
        />
      </ScrollView>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.background.default,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
})
