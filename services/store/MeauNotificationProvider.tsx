import React, { ReactNode, useContext, useEffect, useRef, useState } from "react"
import { Platform } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { ExpoPushTokenContext } from "./TokenContext"
import { LoggedInUserContext } from "./LoggedInUserContext"
import storeToken from "../api/messaging/storeToken"
import { FirebaseAppContext } from "./firebaseAppContext"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export interface IMeauNotificationProviderProps {
  children: ReactNode
}

export function MeauNotificationProvider({
  children,
}: IMeauNotificationProviderProps) {
  const [expoPushToken, setExpoPushToken] = useState("")
  const [notification, setNotification] = useState<
  Notifications.Notification | undefined
  >(undefined)
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()
  // Para armazenar token no usuário
  const firebaseApp = useContext(FirebaseAppContext)
  const loggedInUser = useContext(LoggedInUserContext)

  // Listeners de notificação
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`))

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification)
      })

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response)
      })

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        )
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  //
  useEffect(() => {
    if(!loggedInUser) return
    storeToken(expoPushToken, firebaseApp, loggedInUser.id)
  }, [loggedInUser, expoPushToken])

  return (
    <ExpoPushTokenContext.Provider value={expoPushToken}>
      {/* <Text>Your Expo push token: {expoPushToken}</Text> */}
      {/* <Text>{JSON.stringify(notification?.request.content.title) ?? "none"}</Text> */}
      {/* <Button onPress={() => sendPushNotification(expoPushToken)}><Text>Enviar Notificacao</Text></Button> */}
      {children}
    </ExpoPushTokenContext.Provider>
  )
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!",
      )
      return
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId
    if (!projectId) {
      handleRegistrationError("Project ID not found")
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data
      console.log(pushTokenString)
      return pushTokenString
    } catch (e: unknown) {
      handleRegistrationError(`${e}`)
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications")
  }
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage)
  throw new Error(errorMessage)
}
