import React, { ReactNode, useContext, useEffect, useRef, useState } from "react"
import { LoggedInUserContext } from "./LoggedInUserContext"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { FirebaseAppContext } from "./firebaseAppContext"
import { Snapshot, User } from "@/models"
import getUserAction from "../api/user/getUserAction"
import storeToken from "../api/messaging/storeToken"
import { ExpoPushTokenContext } from "./TokenContext"

export interface ILoggedInUserProviderProps {
  children: ReactNode
}

/** Deve vir após FirebaseAppProvider */
export default function LoggedInUserProvider({
  children,
}: ILoggedInUserProviderProps) {
  const firebaseApp = useContext(FirebaseAppContext)
  const auth = getAuth(firebaseApp)
  const [user, setUser] = useState<Snapshot<User> | null>(null)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        getUserAction(user.uid, firebaseApp).then((document) => {
          if (!document) return
          setUser({ data: document, id: user.uid })
        })        
      } else {
        // User is signed out
        setUser(user)
      }
    })
  }, [auth, ExpoPushTokenContext])

  return (
    <LoggedInUserContext.Provider value={user}>
      {children}
    </LoggedInUserContext.Provider>
  )
}
