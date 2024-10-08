import { ScrollView, StyleSheet, Text, View } from "react-native"
import React from "react"
import { Button, MD3Theme, useTheme } from "react-native-paper"
import { DrawerScreenProps } from "@react-navigation/drawer"
import { RootStackParamList } from "../Navigation/RootStack"

type Props = DrawerScreenProps<RootStackParamList, "addPetsSuccess">

export default function PetRegistrationSuccess({ navigation }: Props) {
  const theme = useTheme()
  const styles = makeStyles(theme)

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Eba!</Text>
        <View style={styles.flavor}>
          <Text style={styles.flavorText}>
            O cadastro do seu pet foi realizado com sucesso!
          </Text>
          <Text style={styles.flavorText}>
            Certifique-se que permitiu o envio de notificações por push no campo
            privacidade do menu configurações do aplicativo. Assim poderemos te
            avisar assim que alguém interessado entrar em contato!
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={() => {
            navigation.navigate("homeDrawer")
          }}
        >
          <Text>Meus Pets</Text>
        </Button>
      </View>
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
      color: theme.colors.primary,
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
