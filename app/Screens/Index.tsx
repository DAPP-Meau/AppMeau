import React, { StyleSheet, Text, View, Image } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Button, MD3Theme, useTheme } from "react-native-paper"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { LayoutParamList } from "../Navigation/Layout"
import { StackNavigationProp } from "@react-navigation/stack"

export default function Index() {
  const navigation = useNavigation<StackNavigationProp<LayoutParamList>>()
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const styles = makeStyles(theme, insets)

  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary} />
      <View style={styles.insetsPad}>
        <View style={styles.container}>
          <Text style={styles.title}>Olá!</Text>
          <View style={styles.flavor}>
            <Text style={styles.flavorText}>Bem vindo ao Meau!</Text>
            <Text style={styles.flavorText}>
              Aqui você pode adotar, doar e ajudar cães e gatos com facilidade.
            </Text>
            <Text style={styles.flavorText}>Registre-se gratuitamente!</Text>
          </View>
          <View style={styles.buttonsView}>
            <Button
              mode="contained"
              uppercase
              onPress={() => navigation.navigate("userRegistration")}
            >
              REGISTRE-SE JÁ
            </Button>
            <Button
              mode="text"
              labelStyle={{ textDecorationLine: "underline" }}
              uppercase
              textColor={theme.colors.inversePrimary}
              onPress={() => navigation.navigate("login")}
            >
              Login
            </Button>
          </View>
          <Image
            style={styles.imageStyle}
            source={require("@/assets/images/Meau_marca_2.png")}
          />
        </View>
      </View>
    </>
  )
}

const makeStyles = (theme: MD3Theme, insets: EdgeInsets) =>
  StyleSheet.create({
    insetsPad: {
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      alignItems: "center",
    },
    container: {
      flex: 1,
      width: "100%",
      paddingHorizontal: 48,
      paddingTop: 48,
      alignItems: "center",
      justifyContent: "flex-start",
    },
    title: {
      fontSize: 72,
      paddingBottom: 52,
      color: theme.colors.primary,
      fontFamily: "Courgette_Regular",
    },
    flavor: {
      width: "100%",
      paddingBottom: 48,
      gap: 12,
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
      gap: 14,
      paddingBottom: 44,
    },
    loginText: {
      color: theme.colors.onSurface,
      fontSize: 16,
      fontFamily: "Roboto_Regular",
    },
    imageStyle: {
      flex: 1,
      width: "50%",
      alignItems: "center",
      justifyContent: "flex-start",
      resizeMode: "contain",
    },
  })
