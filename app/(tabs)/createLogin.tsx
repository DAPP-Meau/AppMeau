import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  StatusBar,
  View,
  Image,
  Button,
} from "react-native";
import { firebase } from "../../firebase";
import { useState } from "react";
import ScrollView = Animated.ScrollView;
import Colors from "@/constants/Colors";
import { router } from "expo-router";

export default function CreateLogin() {
  // Supondo que você irá implementar a lógica para esses estados
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validadepassword, setValidadepassword] = useState({ case: false, number: false, length: false, password: password });
  const auth = getAuth(firebase);
  const fun = () => {
    createUserWithEmailAndPassword(auth, email, validadepassword.password)
      .then((UserCredencial) => {
        const user = UserCredencial.user;
        alert(fullName + ', Seu usuario: ' + email + ' foi criado com sucesso. Faça o login!');
        router.replace('/login');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          alert('Esse endereço de email já esta em uso!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('Esse endereço de e-mail é inválido!');
        }

        alert(error);
        router.replace('/');
      });



  };

  const secureText = (password: string) => {
    const regexUpperCasse = RegExp(/[A-Z]/)
    const regexLowerCasse = RegExp(/[a-z]/)
    const regexNumber = RegExp(/[0-9]/)
    const length = password.length >= 6

    setValidadepassword({
      case: regexUpperCasse.test(password) && regexLowerCasse.test(password),
      number: regexNumber.test(password),
      length: length,
      password: password

    })

  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor={Colors.tintLight.blue1} />
      <Text style={styles.infoText}>
        As informações preenchidas serão divulgadas apenas para a pessoa com a
        qual você realizar o processo de adoção e/ou apadrinhamento após a
        formalização do processo.
      </Text>
      <Text style={styles.sectionTitle}>Informações Pessoais</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.text.gray4}
        placeholder="Nome completo"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.text.gray4}
        placeholder="Idade"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.text.gray4}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.text.gray4}
        placeholder="Estado"
        value={state}
        onChangeText={setState}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.text.gray4}
        placeholder="Cidade"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.text.gray4}
        placeholder="Endereço"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.text.gray4}
        placeholder="Telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Informações de Perfil</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.text.gray4}
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholderTextColor={Colors.text.gray4}
        placeholder="Senha"
        onChangeText={setPassword => secureText(setPassword)}
      />
      <Text style={styles.Title}>Sua senha deve ter:</Text>
      <View style={styles.View_style}>
        <Image style={styles.image}
          source={validadepassword.length ? require("../../assets/images/check-png.png") : require("../../assets/images/ImageClose.png")} />
        <Text style={styles.Text}>6 Caracteres</Text>
      </View>
      <View style={styles.View_style}>
        <Image style={styles.image}
          source={validadepassword.number ? require("../../assets/images/check-png.png") : require("../../assets/images/ImageClose.png")} />

        <Text style={styles.Text}>Numeros</Text>
      </View>
      <View style={styles.View_style}>
        <Image style={styles.image}
          source={validadepassword.case ? require("../../assets/images/check-png.png") : require("../../assets/images/ImageClose.png")} />

        <Text style={styles.Text}>Letra maiúscula e minúscula</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.text.gray4}
        placeholder="Confirmação de senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Text style={styles.sectionTitle}>Foto de Perfil</Text>
      {/* Este é um espaço reservado para a lógica de adicionar foto */}
      <TouchableOpacity style={styles.photoPlaceholder}>
        <Text style={styles.photoText}>Adicionar Foto</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={fun}>
        <Text style={styles.buttonText}>FAZER CADASTRO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.default,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  infoText: {
    width: "100%",
    backgroundColor: Colors.tintLight.blue2,
    textAlign: "center",
    padding: 8,
    fontSize: 14,
    color: Colors.text.gray2,
    borderRadius: 2,
    fontFamily: 'Roboto_Regular',

  },
  sectionTitle: {
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
    textTransform: "uppercase",
    color: Colors.tintLight.blue1,
    fontFamily: 'Roboto_Regular',

  },
  input: {
    width: "100%",
    height: 50,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderWidth: 0.8,
    borderColor: Colors.text.gray3,
    padding: 10,
    marginBottom: 15,
    fontSize: 14,
    color: "black",
    backgroundColor: "transparent",
    fontFamily: 'Roboto_Regular',

  },
  photoPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: "#ddd",
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  photoText: {
    textAlign: "center",
  },
  button: {
    width: "80%",
    height: 40,
    backgroundColor: Colors.tintLight.blue1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    elevation: 4
  },
  buttonText: {
    color: Colors.text.gray2,
    fontSize: 12,
    fontFamily: 'Roboto_Regular',
    fontWeight: "normal",
  },
  View_style: {
    flexDirection: "row",
    marginTop: 4,
    alignItems: "center",
  },
  image: {
    width: 10,
    height: 10,
  },
  Title: {
    marginTop: 18,
  },
  Text: {
    marginLeft: 4,
  }
});

