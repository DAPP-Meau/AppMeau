import React, {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native"

import { StatusBar } from "expo-status-bar"
import Colors from "@/constants/Colors"
import { Link, Redirect } from "expo-router"
import { useContext } from "react"
import { FirebaseAppContext } from "@/services/firebaseAppContext"
import { getAuth } from "firebase/auth"

export default function Introduction() {
  const firebaseApp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseApp)

  // Caso o usuário esteja logado, ele não precisa ver essa página e então é
  // navegado para /(app)/
  if (auth.currentUser) {
    return <Redirect href="/(app)/" />
  } else {
    return (
      <ScrollView>
        <View style={styles.container}>
          <StatusBar backgroundColor={Colors.background.default} />
          <Text style={styles.title}>Olá!</Text>
          <View style={styles.flavor}>
            <Text style={styles.flavorText}>Bem vindo ao Meau!</Text>
            <Text style={styles.flavorText}>
              Aqui você pode adotar, doar e ajudar cães e gatos com facilidade.
            </Text>
            <Text style={styles.flavorText}>
              Registre-se gratuitamente!
            </Text>
          </View>
          <View style={styles.buttonsView}>

            <Link push href="/userRegistration" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>REGISTRE-SE JÁ</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Link push href="/login" asChild>
            <TouchableOpacity style={styles.login}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </Link>

          <Image
            style={{
              flex: 1,
              height: null,
              width: "50%",
              resizeMode: "contain",
            }}
            source={require("@/assets/images/Meau_marca_2.png")}
          />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 48,
    paddingVertical: 48,
  },
  title: {
    fontSize: 72,
    paddingBottom: 52,
    color: Colors.tintLight.yellow1,
    fontFamily: "Courgette_Regular",
  },
  flavor: {
    width: "100%",
    paddingBottom: 48,
    gap: 12
  },
  flavorText: {
    width: "100%",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Roboto_Regular",
    color: Colors.text.gray1,
  },
  buttonsView: {
    width: 232,
    gap: 6,
    paddingBottom: 44,
  },
  button: {
    width: "100%",
    height: 40,
    borderRadius: 2,
    backgroundColor: Colors.tintLight.yellow1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
  },
  buttonText: {
    color: Colors.text.gray2,
    fontSize: 12,
    fontFamily: "Roboto_Regular",
  },
  login: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: Colors.tintLight.blue1,
    fontSize: 16,
    fontFamily: "Roboto_Regular",
  },
})
