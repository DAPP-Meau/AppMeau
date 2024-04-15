// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {getAuth} from "firebase/auth";
// import {getFirestore} from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyC5nROlXzku_JSAbMK9as76-0XcTE9eJvc",
//     authDomain: "meau-b87bf.firebaseapp.com",
//     projectId: "meau-b87bf",
//     storageBucket: "meau-b87bf.appspot.com",
//     messagingSenderId: "457724852582",
//     appId: "1:457724852582:web:c1504b7ac6d2c0fab930a7"
// };
//
// // Initialize Firebase
// export const FIREBASE_APP = initializeApp(firebaseConfig);
// export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
// export const FIREBASE_DB = getFirestore(FIREBASE_APP);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';  // Adicionando a importação do AsyncStorage

const firebaseConfig = {
    apiKey: "gerado pelo firebase",
    authDomain: "gerado pelo firebase",
    projectId: "gerado pelo firebase",
    storageBucket: "gerado pelo firebase",
    messagingSenderId: "gerado pelo firebase",
    appId: "gerado pelo firebase"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const FIREBASE_DB = getFirestore(FIREBASE_APP);

// Export configurations
export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB };
