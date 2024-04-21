import { StyleSheet, StatusBar, ScrollView } from "react-native";

import Colors from "@/constants/Colors";
import CreateUser from "@/components/completedForms/CreateUser";
import { PaperProvider } from "react-native-paper";
import { lightModeBlueTheme } from "@/constants";

export default function CreateLogin() {
  return (
    <PaperProvider theme={lightModeBlueTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar backgroundColor={Colors.tintLight.blue1} />
        <CreateUser />
      </ScrollView>
    </PaperProvider>
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
