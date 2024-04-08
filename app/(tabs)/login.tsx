import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useState } from "react";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implemente a lógica de login aqui
    alert("Login pressionado!");
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.passwordBox}
      >
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.text.gray4}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.text.gray4}
          placeholder="Senha"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
      </View>
      <View style={{ width: "80%" }}>
        <View style={{ marginBottom: 72 }}>
          <TouchableOpacity
            style={[styles.buttonLogin, { backgroundColor: Colors.tintLight.blue1 }]}
            onPress={handleLogin}
          >
            <Text style={[styles.buttonLoginText, { color: Colors.text.gray2 }]}>
              ENTRAR
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 4 }}>
          <TouchableOpacity
            style={[styles.buttonLogin, { backgroundColor: "#194f7c" }]}
            onPress={handleLogin}
          >
            <FontAwesome
              style={{ color: Colors.text.white1 }}
              name="facebook"
              size={28}
            />
            <Text
              style={[styles.buttonLoginText, { color: Colors.text.white1 }]}
            >
              ENTRAR COM FACEBOOK
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonLogin, { backgroundColor: "#f15f5c" }]}
            onPress={handleLogin}
          >
            <FontAwesome
              style={{ color: Colors.text.white1 }}
              name="google"
              size={25}
            />
            <Text style={[styles.buttonLoginText, { color: Colors.text.white1 }]}>
              ENTRAR COM GOOGLE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  passwordBox: {
    width: "100%",
    marginTop: 30,
    marginBottom: 52,
  },
  input: {
    width: "100%",
    height: 50,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderWidth: 0.8,
    borderColor: "#e6e7e8",
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    color: "black",
  },
  buttonLogin: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    marginTop: 10,
    gap: 8,
  },
  buttonLoginText: {
    color: Colors.text.gray2,
    fontSize: 12,
    fontWeight: "normal",
  },
});
