import { StackScreenProps } from "@react-navigation/stack"
import React, { useState, useCallback, useEffect, useContext } from "react"
import { GiftedChat, IMessage } from "react-native-gifted-chat"
import { RootStackParamList } from "../Navigation/RootStack"
import {
  collection,
  getFirestore,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { collectionPaths } from "@/constants"
import getCurrentUserUID from "@/utils/getCurrentUser"
import getUserAction from "@/services/api/user/getUserAction"
import { User } from "@/models"

type Props = StackScreenProps<RootStackParamList, "chat">

export default function Chat({ route }: Props) {
  const firebaseApp = useContext(FirebaseAppContext)
  const db = getFirestore(firebaseApp)
  const loggedInUser = getCurrentUserUID(firebaseApp)
  const [loggedInUserDocument, setLoggedInUserDocument] = useState<User>()
  const [messages, setMessages] = useState<Array<IMessage>>([])

  const documentReference = doc(db, collectionPaths.rooms, route.params.roomId)
  const messagesCollectionReference = collection(
    documentReference,
    collectionPaths.rooms_messages,
  )

  useEffect(() => {
    if (loggedInUser) {
      callback()
    }
    async function callback() {
      if (!loggedInUser) throw new Error("No logged in user!")
      const tempUser = await getUserAction(loggedInUser, firebaseApp)
      setLoggedInUserDocument(tempUser)
    }
  }, [loggedInUser])

  useEffect(() => {
    const q = query(
      messagesCollectionReference,
      limit(100),
      orderBy("createdAt", "desc"),
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tempMessages: IMessage[] = []
      for (const doc of snapshot.docs) {
        const data = doc.data() as IMessage
        console.log(data)
        if (!data.createdAt) continue
        tempMessages.push({
          _id: doc.id,
          createdAt: data.createdAt.toDate(),
          text: data.text,
          user: data.user,
        })
      }
      setMessages(tempMessages)
    })

    return () => unsubscribe()
  }, [firebaseApp])

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const writeBatch = async () => {
        const batch = newMessages.map(async (message) => {
          await addDoc(messagesCollectionReference, {
            text: message.text,
            createdAt: serverTimestamp(),
            user: message.user,
          })
        })

        await Promise.all(batch)
      }

      await writeBatch()
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages),
      )
    },
    [firebaseApp],
  )

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
        name: loggedInUserDocument?.person.fullName ?? "none",
      }}
    />
  )
}
