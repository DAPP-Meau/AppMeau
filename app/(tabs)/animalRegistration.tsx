import CreateAdoptForm from "@/components/completedForms/CreateAdoptForm";
import Colors from "@/constants/Colors";
import { createAdoptAction } from "@/services/actions";
import { FirebaseAppContext } from "@/services/firebaseAppContext";
import { StatusBar } from "expo-status-bar";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useContext } from "react";
import React, { ScrollView, StyleSheet } from "react-native";

export interface IAnimalRegistrationProps {}

export default function AnimalRegistration(props: IAnimalRegistrationProps) {
  const firebaseapp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseapp);
  const db = getFirestore(firebaseapp);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor={Colors.tintLight.yellow1} />
      <CreateAdoptForm onSubmit={async (fields, form) => {createAdoptAction(fields, form, db, auth)}}/>
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
