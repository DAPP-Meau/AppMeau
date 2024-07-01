import { firebaseAppConfig } from '@/constants/firebaseConfig';
import {initializeApp} from 'firebase/app'
import { createContext } from 'react';

export const FirebaseAppContext = createContext(initializeApp(firebaseAppConfig))