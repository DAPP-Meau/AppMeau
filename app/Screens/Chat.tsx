import { StackScreenProps } from "@react-navigation/stack"
import React, { useState, useEffect, useContext, useCallback } from "react"
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
  const loggedInUserID = getCurrentUserUID(firebaseApp)
  const [loggedInUserDocument, setLoggedInUserDocument] = useState<User>()
  const [messages, setMessages] = useState<Array<IMessage>>([])

  const documentReference = doc(db, collectionPaths.rooms, route.params.roomId)
  const messagesCollectionReference = collection(
    documentReference,
    collectionPaths.rooms_messages,
  )

  // Pegar documento do usuário logado
  useEffect(() => {
    if (loggedInUserID) {
      callback()
    }

    async function callback() {
      if (!loggedInUserID) throw new Error("No logged in user!")
      const tempUser = await getUserAction(loggedInUserID, firebaseApp)
      setLoggedInUserDocument(tempUser)
    }
  }, [loggedInUserID])

  // Event Listener de mensagens novas do firebase.
  useEffect(() => {
    const q = query(
      messagesCollectionReference,
      orderBy("createdAt", "desc"),
      limit(100),
    )
    // Possível optmização: pegar mensagens iniciais com uma requisição normal
    // e depois registrar esse event listener para pegar só as mensagens novas.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tempMessages: IMessage[] = []
      for (const doc of snapshot.docs) {
        const data = doc.data() as IMessage
        const { createdAt, ...restOfMessage } = data
        // On snapshot atualiza para mensagens locais, quando isso acontece
        // createdAt é undefined, pois as horas são criadas apenas quando
        // o documento criado em onSend chega ao servidor
        if (!createdAt) continue
        tempMessages.push({
          ...restOfMessage,
          // Erro de tipo, coerção necessária. Só não sei como...
          createdAt: data.createdAt.toDate(), 
        })
      }
      setMessages(tempMessages)
    })

    return () => unsubscribe()
  }, [firebaseApp])

  // Callback de mensagens novas
  const onSend = useCallback(
    async (newMessages: IMessage[] = []) => {
      const writeBatch = async () => {
        const batch = newMessages.map((message) => {
          // Nós realmente queremos ignorar createdAt
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { createdAt: _, ...restOfMessage } = message

          const pushDoc: IMessage = {
            // @ts-expect-error 2339 Firebase armazena dados numa classe != Date
            createdAt: serverTimestamp(),
            ...restOfMessage,
          }

          return addDoc(messagesCollectionReference, pushDoc)
        })

        // batch é uma lista de promises. Usando Promise.all podemos executar
        // paralelamente todos os pedidos.
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
        _id: loggedInUserID ?? 0,
        name: loggedInUserDocument?.person.fullName ?? "null",
        avatar: loggedInUserDocument?.person.pictureURL
      }}
    />
  )
}
