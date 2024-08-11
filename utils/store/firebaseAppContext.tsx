import { firebaseAppConfig } from '@/constants/firebaseConfig';
import {initializeApp} from 'firebase/app'
import { createContext } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage"

export const FirebaseAppContext = createContext(initializeApp(firebaseAppConfig))