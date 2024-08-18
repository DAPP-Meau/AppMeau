import React, { ReactNode, useContext, useEffect, useState } from "react"
import { LoggedInUserContext } from "./LoggedInUserContext"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { FirebaseAppContext } from "./firebaseAppContext"

export interface ILoggedInUserProviderProps {
  children: ReactNode
}

export default function LoggedInUserProvider({
  children,
}: ILoggedInUserProviderProps) {
  const firebaseApp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseApp)
  const [uid, setUid] = useState<User|null>(null)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        setUid(user)
        // ...
      } else {
        // User is signed out
        setUid(user)
        // ...
      }
    })
  }, [auth])

  return (
    <LoggedInUserContext.Provider value={uid}>
      {children}
    </LoggedInUserContext.Provider>
  )
}
