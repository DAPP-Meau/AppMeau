import Adopt from "@/components/completedForms/Adopt";
import Colors from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import React, { ScrollView, StyleSheet } from "react-native";

export interface IAnimalRegistrationProps {}

export default function AnimalRegistration(props: IAnimalRegistrationProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor={Colors.tintLight.yellow1} />
      <Adopt onSubmit={(e) => {console.log(e); return new Promise((resolve) => {resolve(true)})}}/>
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
});
