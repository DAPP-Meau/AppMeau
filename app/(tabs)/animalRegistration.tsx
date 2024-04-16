import Adopt from "@/components/cadastrosAnimal/Adopt";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  View,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";

type ButtonState = {
  selected: boolean;
  enabled: boolean;
};

export interface IAnimalRegistrationProps {}

export default function AnimalRegistration(props: IAnimalRegistrationProps) {
  const [adoptSelected, setAdoptSelected] = useState(false);
  const [patronizeSelected, setPatronizeSelected] = useState(false);
  const [helpSelected, setHelpSelected] = useState(false);

  const toggle = (
    b: boolean,
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter(!b);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor={Colors.tintLight.yellow1}/>
      <View style={{ width: "100%", gap: 16 }}>
        <Text style={{ fontSize: 14, color: "#757575" }}>
          Tenho interesse em cadastrar o animal para:
        </Text>
        <View style={{ flexDirection: "row", flex: 1, gap: 16 }}>
          <MyButton
            title="Adoção"
            selected={adoptSelected}
            enabled={!(patronizeSelected && helpSelected)}
            onPress={() => {
              toggle(adoptSelected, setAdoptSelected);
            }}
          />
          <MyButton
            title="Apadrinhar"
            selected={patronizeSelected}
            enabled={!adoptSelected}
            onPress={() => {
              toggle(patronizeSelected, setPatronizeSelected);
            }}
          />
          <MyButton
            title="Ajudar"
            selected={helpSelected}
            enabled={!(adoptSelected && patronizeSelected)}
            onPress={() => {
              toggle(helpSelected, setHelpSelected);
            }}
          />
        </View>
      </View>
      <View style={{width:"100%"}}>
        {adoptSelected && <Adopt />}
        {patronizeSelected && <Text>"Renderizar Patronize"</Text>}
        {helpSelected && <Text>"Renderizar Help"</Text>}
        {(adoptSelected || patronizeSelected || helpSelected) && (
          <Text>"Renderizar botão de confirmação</Text>
        )}
      </View>
    </ScrollView>
  );
}

interface ButtonProps {
  title: string;
  enabled: boolean;
  selected: boolean;
  onPress?: any;
}

function MyButton({ title, enabled, selected, onPress }: ButtonProps) {
  const getButtonStyle = () => {
    return enabled
      ? selected
        ? styles.buttonEnabled
        : styles.buttonDisabled
      : styles.buttonDisabled;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle()]}
      onPress={() => {
        if (enabled) {
          onPress();
        }
      }}>
      <Text
        style={[
          styles.buttonText,
          enabled ? { color: Colors.text.gray2 } : { color: "#bdbdbd" },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.background.default,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  button: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    elevation: 4,
    padding: 5,
  },
  buttonText: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  buttonEnabled: {
    backgroundColor: Colors.tintLight.yellow1,
  },
  buttonDisabled: {
    backgroundColor: "#f1f2f2",
  },
  buttonUnSelected: {
    backgroundColor: Colors.tintLight.yellow1,
  },
});
