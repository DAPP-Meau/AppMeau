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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor={Colors.tintLight.yellow1}/>
      <Adopt />
    </ScrollView>
  );
}

interface ButtonProps {
  title: string;
  enabled: boolean;
  selected: boolean;
  onPress?: any;
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
