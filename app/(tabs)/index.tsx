import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";

import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";

export default function Introduction() {
  const handleLogin = () => {
    // Implemente a lógica de login aqui
    alert("Login pressionado!");
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.background.default} />
      <Text style={styles.title}>Olá!</Text>
      <View style={styles.flavor}>
        <Text style={styles.flavorText}>Bem vindo ao Meau!</Text>
        <Text style={styles.flavorText}>
          Aqui você pode adotar, doar e ajudar cães e gatos com facilidade. Qual
          o seu interesse?
        </Text>
      </View>
      <View style={styles.buttonsView}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ADOTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>AJUDAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>CADASTRAR ANIMAL</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.login}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <Image
        style={{ flex:1, height:null, width: '50%', resizeMode: "contain" }}
        source={require("../../assets/images/Meau_marca_2.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 48,
    paddingTop: 48,
  },
  title: {
    fontSize: 72,
    fontWeight: "bold",
    paddingBottom: 52,
    color: Colors.tintLight.yellow1,
  },
  flavor: {
    width: "100%",
    paddingBottom: 48,
  },
  flavorText: {
    width: "100%",
    fontSize: 16,
    textAlign: "center",
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
    elevation: 1,
  },
  buttonText: {
    color: Colors.text.gray2,
    fontSize: 12,
    fontWeight: "normal",
  },
  login: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: Colors.tintLight.blue1,
    fontSize: 16,
  },
});
