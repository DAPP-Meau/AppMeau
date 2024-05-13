import React, { useContext } from 'react'
import { getAuth } from 'firebase/auth'
import { FirebaseAppContext } from '@/services/firebaseAppContext'
import { loginAction } from '@/services/actions'
import LoginForm from '@/components/completedForms/LoginForm'
import { PaperProvider } from 'react-native-paper'
import { lightModeBlueTheme } from '@/constants'

export default function Login() {
  const firebaseapp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseapp)

  return (
    <PaperProvider theme={lightModeBlueTheme}>
        <LoginForm onSubmit={async (fields, form) => {return loginAction(auth, fields, form)}} />
    </PaperProvider>
  )
}