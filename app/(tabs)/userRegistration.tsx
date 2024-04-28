import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import React, {
  Animated,
  StyleSheet,
  StatusBar,
} from "react-native";

import { firebaseapp } from "../../firebase";
import ScrollView = Animated.ScrollView;
import Colors from "@/constants/Colors";
import { PaperProvider } from "react-native-paper";
import { lightModeBlueTheme } from "@/constants";
import CreateUserForm from "@/components/completedForms/CreateUserForm";
import { createUserAction } from "@/services/actions/createUserAction";


export default function userRegistration() {
  const auth = getAuth(firebaseapp);
  const db = getFirestore(firebaseapp);

  return (
    <PaperProvider theme={lightModeBlueTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar backgroundColor={Colors.tintLight.blue1} />
        <CreateUserForm onSubmit={(form) => createUserAction(form, auth, db)} />
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

