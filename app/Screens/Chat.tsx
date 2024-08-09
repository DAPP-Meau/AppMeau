import { StackScreenProps } from "@react-navigation/stack"
import React, { useState, useCallback, useEffect, useContext } from "react"
import { GiftedChat, IMessage, InputToolbar } from "react-native-gifted-chat"
import { RootStackParamList } from "../Navigation/RootStack"
import {
  collection,
  getFirestore,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"
import { FirebaseAppContext } from "@/services/firebaseAppContext"

type Props = StackScreenProps<RootStackParamList, "chat">

export default function Chat({ route, navigation }: Props) {
  const firebaseApp = useContext(FirebaseAppContext)
  const [messages, setMessages] = useState<Array<IMessage>>([])

  useEffect(() => {
    const db = getFirestore(firebaseApp)
    const messagesCollection = collection(
      db,
      "rooms/XosXGlWEmejG35dVCv7k/messages",
    )

    const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        _id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate(),
        user: doc.data().user,
      }))

      setMessages((prevMessages) =>
        GiftedChat.append(prevMessages, newMessages),
      )
    })

    return () => unsubscribe()
  }, [firebaseApp])

  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const db = getFirestore(firebaseApp)
      const messagesCollection = collection(
        db,
        "rooms/XosXGlWEmejG35dVCv7k/messages",
      )

      const writeBatch = async () => {
        const batch = newMessages.map(async (message) => {
          await addDoc(messagesCollection, {
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
      renderInputToolbar={renderInputToolbar}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
        name: "User Name", // Pode ser qualquer nome de usuário que você esteja usando
      }}
    />
  )
}

function renderInputToolbar(props) {
  return <InputToolbar {...props} />
}
