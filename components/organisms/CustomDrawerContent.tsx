import React, { useContext, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { LoggedInUserContext } from "@/services/store/LoggedInUserContext"
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer"
import { Image } from "expo-image"

export default function CustomDrawerContent({
  navigation,
  state,
  descriptors,
}: DrawerContentComponentProps) {
  const loggedInUser = useContext(LoggedInUserContext)
  const userPhoto = loggedInUser?.data.person.pictureURL
  const nickName = loggedInUser?.data.login.username ?? "null"
  
  const [isPetDropdownOpen, setIsPetDropdownOpen] = useState(false)

  return (
    <DrawerContentScrollView
      contentContainerStyle={styles.drawerContainer}
    >
      <View style={styles.header}>
        <Image source={{ uri: userPhoto }} style={styles.userPhoto} />
        <Text style={styles.nickName}>{nickName}</Text>

        <TouchableOpacity onPress={() => navigation.navigate("profile")}>
          <Text style={styles.profileLink}>Meu Perfil</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsPetDropdownOpen(!isPetDropdownOpen)}
      >
        <Text style={styles.dropdownLabel}>
          PET {isPetDropdownOpen ? "▲" : "▼"}
        </Text>
      </TouchableOpacity>
      {isPetDropdownOpen && (
        <View style={styles.dropdownContent}>
          <DrawerItem
            label="Adotar um pet"
            labelStyle={styles.drawerItemLabel}
            onPress={() => navigation.navigate("petList")}
          />
          <DrawerItem
            label="Registrar seu pet"
            labelStyle={styles.drawerItemLabel}
            onPress={() => navigation.navigate("addPets")}
          />
          <DrawerItem
            label="Meus Pets"
            labelStyle={styles.drawerItemLabel}
            onPress={() => navigation.navigate("userPetList")}
          />
        </View>
      )}

      <DrawerItem
        label="Conversas"
        labelStyle={styles.drawerItemLabel}
        onPress={() => navigation.navigate("openRooms")}
      />
      <DrawerItem
        label="Sair"
        labelStyle={styles.drawerItemLabel}
        onPress={() => navigation.navigate("logout")}
      />

      {/* Preencher o espaço e colocar o logo no final */}
      <View style={{ flexGrow: 1 }} />

      {/* Logotipo com fundo escuro */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBackground}>
          <Image
            source={require("@/assets/images/Meau_marca_2.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  drawerContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f8f9fa",
    marginBottom: 20,
  },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 2,
  },
  nickName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  profileLink: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 5,
  },
  dropdownButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  dropdownLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  dropdownContent: {
    paddingLeft: 30,
  },
  drawerItemLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#495057",
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  logoBackground: {
    //backgroundColor: "#333", // Fundo escuro para destacar a logotipo
    padding: 10,
    borderRadius: 10,
  },
  logo: {
    width: 120,
    height: 50,
  },
})
