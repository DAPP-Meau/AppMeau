import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import {
  Animated,
  StyleSheet,
  StatusBar,
} from "react-native";
import { firebase } from "../../firebase";
import ScrollView = Animated.ScrollView;
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { lightModeBlueTheme } from "@/constants";
import CreateUser from "@/components/completedForms/CreateUser";
import { UserRegistrationForm } from "@/services/models";

export default function CreateLogin() {
  const auth = getAuth(firebase);
  const fun = ({
    email, 
    address,
    age,
    city,
    fullName,
    password,
    phone,
    state
  }: UserRegistrationForm) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((UserCredencial) => {
        const user = UserCredencial.user;
        alert(fullName + ', Seu usuario: ' + email + ' foi criado com sucesso. Faça o login!');
        console.log(user)
        router.navigate('/(tabs)/login');
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

  return (
    <PaperProvider theme={lightModeBlueTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar backgroundColor={Colors.tintLight.blue1} />
        <CreateUser onSubmit={(form) => fun(form)} />
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
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

