import { Text } from "react-native";
import { Stack } from "expo-router/stack";
import { useFonts } from 'expo-font';
import { fonts } from "@/constants";



export default function AppLayout() {
  let [fontsLoaded] = useFonts(fonts);
  if(!fontsLoaded){
    return null;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
