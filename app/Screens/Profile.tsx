import React, { StyleSheet, Text, View } from "react-native"

export default function Profile() {
  return (
    <View style={stylesProfile.container}>
      <Text style={stylesProfile.title}>Meu Perfil</Text>
    </View>
  )
}

const stylesProfile = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343a40",
  },
})
