import { lightModeBlueTheme } from "@/constants"
import { Link } from "expo-router"
import { StatusBar } from "expo-status-bar"
import React from "react"
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { Button, MD3Theme, PaperProvider, useTheme } from "react-native-paper"

export default function Unauthorized() {
  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <ScrollView>
      <PaperProvider theme={lightModeBlueTheme}>
        <View style={styles.container}>
          <StatusBar backgroundColor={theme.colors.secondary} />
          
          <Text style={styles.title}>Ops!</Text>
          <View style={styles.flavor}>
            <Text style={styles.flavorText}>
              Você não pode realizar esta ação sem possuir um cadastro
            </Text>
          </View>

          <View style={styles.buttonsView}>
            <Link push href="/userRegistration" asChild>
              <Button mode="contained">
                <Text>FAZER CADASTRO</Text>
              </Button>
            </Link>

            <Text style={styles.flavorText}>Já possui cadastro?</Text>

            <Link push href="/login" asChild>
              <Button mode="contained">
                <Text>FAZER LOGIN</Text>
              </Button>
            </Link>

          </View>
        </View>
      </PaperProvider>
    </ScrollView>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "flex-start",
      paddingHorizontal: 48,
      paddingVertical: 48,
    },
    title: {
      fontSize: 72,
      paddingBottom: 52,
      color: theme.colors.secondary,
      fontFamily: "Courgette_Regular",
    },
    flavor: {
      width: "100%",
      paddingBottom: 48,
    },
    flavorText: {
      width: "100%",
      fontSize: 16,
      textAlign: "center",
      fontFamily: "Roboto_Regular",
      color: theme.colors.onBackground,
    },
    buttonsView: {
      width: 232,
      gap: 6,
      paddingBottom: 44,
    },

  })
