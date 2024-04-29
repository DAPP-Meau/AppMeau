import React from 'react'
import { getAuth } from 'firebase/auth'
import { firebaseapp } from '../../firebase'
import { loginAction } from '@/services/actions'
import LoginForm from '@/components/completedForms/LoginForm'
import { PaperProvider } from 'react-native-paper'
import { lightModeBlueTheme } from '@/constants'

export default function Login() {
  const auth = getAuth(firebaseapp)

  return (
    <PaperProvider theme={lightModeBlueTheme}>
        <LoginForm onSubmit={(login) => loginAction(auth, login)} />
    </PaperProvider>
  )
}