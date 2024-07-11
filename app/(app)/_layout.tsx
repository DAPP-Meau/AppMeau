import React, { useContext } from "react";
import { Redirect, Slot } from "expo-router";
import { FirebaseAppContext } from "@/services/firebaseAppContext";
import { getAuth } from "firebase/auth";

export default function TabLayout() {
  const firebaseApp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseApp)
  
  if (auth.currentUser) {
    return (
      <Slot />
    );
  } else {
    return (
      <Redirect href="/erroLogin"/>
    );
  }
}
