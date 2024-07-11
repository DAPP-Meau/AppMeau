import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import React, { Animated, StyleSheet, StatusBar } from "react-native";
import { FirebaseAppContext } from "@/services/firebaseAppContext";
import ScrollView = Animated.ScrollView;
import Colors from "@/constants/Colors";
import { PaperProvider } from "react-native-paper";
import { lightModeBlueTheme } from "@/constants";
import CreateUserForm from "@/components/completedForms/CreateUserForm";
import { createUserAction } from "@/services/actions/createUserAction";
import { useContext } from "react";

export default function userRegistration() {
  const firebaseapp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseapp);
  const db = getFirestore(firebaseapp);

  return (
    <PaperProvider theme={lightModeBlueTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar backgroundColor={Colors.tintLight.blue1} />
        <CreateUserForm
          onSubmit={async (fields, form) => {
            await createUserAction(fields, form, auth, db);
          }}
        />
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
});
