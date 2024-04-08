import { StyleSheet, TextInput, TouchableOpacity, Text, View } from "react-native";
import { useState } from "react";
import Colors from "@/constants/Colors";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implemente a lógica de login aqui
    alert("Login pressionado!");
  };

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", marginBottom:52 }}>
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
        <View style={{marginBottom: 72}}>
            <TouchableOpacity
              style={[styles.buttonLogin, { backgroundColor: "#88c9bf" }]}
              onPress={handleLogin}
            >
              <Text style={[styles.buttonLoginText, { color: "#434343" }]}>
                ENTRAR
              </Text>
            </TouchableOpacity>
        </View>
        <View style={{gap:4}}>
            <TouchableOpacity
              style={[styles.buttonLogin, { backgroundColor: "#194f7c" }]}
              onPress={handleLogin}
            >
              <Text style={[styles.buttonLoginText, { color: "#f7f7f7" }]}>
                ENTRAR COM FACEBOOK
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonLogin, { backgroundColor: "#f15f5c" }]}
              onPress={handleLogin}
            >
              <Text style={[styles.buttonLoginText, { color: "#f7f7f7" }]}>
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
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 1,
    color: "#000000",
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
    backgroundColor: "transparent",
  },
  buttonLogin: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    marginTop: 10,
  },
  buttonLoginText: {
    color: "#434343",
    fontSize: 12,
    fontWeight: "normal",
  },
});
