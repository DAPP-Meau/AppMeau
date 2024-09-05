import React, { useContext, useState } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer"
import { useNavigation } from "@react-navigation/native"
import PetList from "../Screens/PetList"
import PetRegistration from "../Screens/PetRegistration"
import Logout from "../Screens/Logout"
import CustomDrawerHeaderBar from "@/components/organisms/CustomDrawerHeaderBar"
import UserPetList from "../Screens/UserPetList"
import OpenRooms from "../Screens/OpenRooms"
import { LoggedInUserContext } from "@/services/store/LoggedInUserContext"

export type HomeDrawerParamList = {
  petList: undefined
  addPets: undefined
  logout: undefined
  userPetList: undefined
  openRooms: undefined
  profile: undefined
}

const Drawer = createDrawerNavigator<HomeDrawerParamList>()

function CustomDrawerContent(props) {
  const [isPetDropdownOpen, setIsPetDropdownOpen] = useState(false)
  const loggedInUser = useContext(LoggedInUserContext)
  const navigation = useNavigation()
  const userPhoto = loggedInUser?.data.person.pictureURL
  const nickName = loggedInUser?.data.login.username ?? "null"

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
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
        <Text style={styles.dropdownLabel}>PET {isPetDropdownOpen ? "▲" : "▼"}</Text>
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

export default function HomeDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerTitleStyle: { fontFamily: "Roboto_Medium" },
        header: (props) => <CustomDrawerHeaderBar {...props} />,
      }}
      initialRouteName="petList"
    >
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: "Meu Perfil",
          title: "Meu Perfil",
        }}
        component={ProfileScreen}
      />
      <Drawer.Screen
        name="petList"
        component={PetList}
        options={{ drawerLabel: () => null, title: null }}
      />
      <Drawer.Screen
        name="addPets"
        component={PetRegistration}
        options={{ drawerLabel: () => null, title: null }}
      />
      <Drawer.Screen
        name="userPetList"
        component={UserPetList}
        options={{ drawerLabel: () => null, title: null }}
      />
      <Drawer.Screen
        name="openRooms"
        component={OpenRooms}
        options={{ drawerLabel: () => null, title: null }}
      />
      <Drawer.Screen
        name="logout"
        component={Logout}
        options={{ drawerLabel: () => null, title: null }}
      />
    </Drawer.Navigator>
  )
}

function ProfileScreen() {
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
