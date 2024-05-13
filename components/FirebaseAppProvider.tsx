import React, { ReactNode } from 'react'
import { FirebaseAppContext } from '@/services/firebaseAppContext'
import { firebaseAppConfig } from '@/constants/firebaseConfig'
import { initializeApp } from 'firebase/app'

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