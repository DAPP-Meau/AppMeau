import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import React, { useState } from "react";
import { Button, MD3Theme, TextInput, useTheme } from "react-native-paper";
import Colors from "@/constants/Colors";
import { UserRegistrationForm } from "@/services/models";

export interface CreateUserProps {
  onSubmit?: (form: UserRegistrationForm, e?: GestureResponderEvent) => boolean | void;
}

export default function CreateUser({ onSubmit }: CreateUserProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | undefined>();
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        As informações preenchidas serão divulgadas apenas para a pessoa com a
        qual você realizar o processo de adoção e/ou apadrinhamento após a
        formalização do processo.
      </Text>
      <View style={{ gap: 8 }}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <TextInput
          label="Nome completo"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          label="Idade"
          value={String(age ?? "")}
          onChangeText={(e) => setAge(Number(e))}
          keyboardType="numeric"
        />

        <TextInput label="Estado" value={state} onChangeText={setState} />
        <TextInput label="Cidade" value={city} onChangeText={setCity} />
        <TextInput label="Endereço" value={address} onChangeText={setAddress} />
        <TextInput
          label="Telefone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={styles.sectionTitle}>Informações de Perfil</Text>
        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          label="Confirmação de senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      {/* Botão de adicionar foto */}
      <View style={{ gap: 8 }}>
        <Text style={styles.sectionTitle}>Foto de Perfil</Text>
        <TouchableOpacity style={styles.photoPlaceholder}>
          <Text style={styles.photoText}>Adicionar Foto</Text>
        </TouchableOpacity>
      </View>

      <Button
        mode="contained"
        onPress={(e) => {
          onSubmit?.(
            {
              fullName: fullName,
              age: age ?? 0,
              state: state,
              city: city,
              address: address,
              email: email,
              phone: phone,
              password: password,
            },
            e
          );
        }}
      >
        <Text>FAZER CADASTRO</Text>
      </Button>
    </View>
  );
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      marginVertical: 42,
      gap:16,
    },
    infoText: {
      width: "100%",
      backgroundColor: theme.colors.secondaryContainer,
      textAlign: "center",
      padding: 8,
      fontSize: 14,
      color: theme.colors.onSecondaryContainer,
      borderRadius: 2,
      fontFamily: "Roboto_Regular",
    },
    sectionTitle: {
      alignSelf: "flex-start",
      marginTop: 20,
      marginBottom: 10,
      fontSize: 16,
      textTransform: "uppercase",
      color: theme.colors.secondary,
      fontFamily: "Roboto_Regular",
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
      fontFamily: "Roboto_Regular",
    },
    photoPlaceholder: {
      width: "50%",
      height: 150,
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
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
      elevation: 4,
    },
    buttonText: {
      color: Colors.text.gray2,
      fontSize: 12,
      fontFamily: "Roboto_Regular",
      fontWeight: "normal",
    },
  });
