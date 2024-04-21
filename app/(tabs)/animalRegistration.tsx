import Adopt from "@/components/cadastrosAnimal/Adopt";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import React, { ScrollView, StyleSheet } from "react-native";

export interface IAnimalRegistrationProps {}

export default function AnimalRegistration(props: IAnimalRegistrationProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor={Colors.tintLight.yellow1} />
      <Adopt />
    </ScrollView>
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
