import React, { ReactNode } from 'react'
import { FirebaseAppContext } from '@/services/store/firebaseAppContext'
import { firebaseAppConfig } from '@/constants/firebaseConfig'
import { initializeApp } from 'firebase/app'
import { setLogLevel as setFirestoreLogLevel } from "firebase/firestore";
setFirestoreLogLevel('info');

interface Props {
    children: ReactNode
}

export default function FirebaseAppProvider({children}: Props) {
  return (
    <FirebaseAppContext.Provider value={initializeApp(firebaseAppConfig)}>
      {children}
    </FirebaseAppContext.Provider>
  )
}