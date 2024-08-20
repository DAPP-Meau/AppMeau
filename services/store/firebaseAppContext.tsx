import { firebaseAppConfig } from "@/constants/firebaseConfig"
import { FirebaseApp, initializeApp } from "firebase/app"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import { createContext } from "react"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"

function getEmulatorOrNot(): FirebaseApp {
  const firebaseApp: FirebaseApp = initializeApp(firebaseAppConfig)
  // Inicializar permanência
  const auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  })
  
  const variables = [
    process.env.EXPO_PUBLIC_EMULATOR_AUTH_URL,
    process.env.EXPO_PUBLIC_EMULATOR_FIRESTORE_HOST,
    process.env.EXPO_PUBLIC_EMULATOR_FIRESTORE_PORT,
    process.env.EXPO_PUBLIC_EMULATOR_STORAGE_HOST,
    process.env.EXPO_PUBLIC_EMULATOR_STORAGE_PORT,
  ]

  const status = variables.map((val) => {
    return typeof val !== "undefined"
  })

  const allValuesSet = status.every((val) => {
    return val == true
  })
  const someValuesSet = status.some((val) => {
    return val == true
  })

  if (allValuesSet) {
    console.info("MEAU is using firebase emulator")
    const auth = getAuth(firebaseApp)
    const db = getFirestore(firebaseApp)
    const storage = getStorage(firebaseApp)
    // @ts-expect-error 2345 Já estamos verificando se a variável existe nas funções acima,
    // mas parece que o typescript não entendeu
    connectAuthEmulator(auth, process.env.EXPO_PUBLIC_EMULATOR_AUTH_URL)

    connectFirestoreEmulator(
      db,
      // @ts-expect-error 2345 Já estamos verificando se a variável existe nas funções acima,
      // mas parece que o typescript não entendeu
      process.env.EXPO_PUBLIC_EMULATOR_FIRESTORE_HOST,
      process.env.EXPO_PUBLIC_EMULATOR_FIRESTORE_PORT,
    )
    connectStorageEmulator(
      storage,
      // @ts-expect-error 2345 Já estamos verificando se a variável existe nas funções acima,
      // mas parece que o typescript não entendeu
      process.env.EXPO_PUBLIC_EMULATOR_STORAGE_HOST,
      process.env.EXPO_PUBLIC_EMULATOR_STORAGE_PORT,
    )
  } else if (someValuesSet) {
    console.info(
      "Some Firebase Emulator variables are set, but not all, using project configuration",
    )
  }
  return firebaseApp
}

export const FirebaseAppContext = createContext<FirebaseApp>(getEmulatorOrNot())
