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
  getDoc,
} from "firebase/firestore"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { collectionPaths } from "@/constants"
import getCurrentUserUID from "@/utils/getCurrentUser"
import getUserAction from "@/services/api/user/getUserAction"
import { Room, roomSchema, User } from "@/models"
import sendPushNotification from "@/services/api/messaging/sendPushNotification"
import { createChatPushMessage } from "@/services/api/messaging/createPushMessage"
import { Text } from "react-native"

type Props = StackScreenProps<RootStackParamList, "chat">

export default function Chat({ route }: Props) {
  const firebaseApp = useContext(FirebaseAppContext)
  const db = getFirestore(firebaseApp)
  const loggedInUserID = getCurrentUserUID(firebaseApp)
  const [loggedInUserDocument, setLoggedInUserDocument] = useState<User>()
  const [userID, setUserID] = useState<string>()
  const [roomDocument, setRoomDocument] = useState<Room>()
  const [messages, setMessages] = useState<Array<IMessage>>([])

  const roomDocumentReference = doc(
    db,
    collectionPaths.rooms,
    route.params.roomId,
  )
  const messagesCollectionReference = collection(
    roomDocumentReference,
    collectionPaths.rooms_messages,
  )

  // Pegar documento do usuário logado e do usuário do chat
  useEffect(() => {
    if (loggedInUserID) {
      callback()
    }

    async function callback() {
      if (!loggedInUserID) throw new Error("No logged in user!")
      const _loggedInUserDocument = await getUserAction(
        loggedInUserID,
        firebaseApp,
      )
      setLoggedInUserDocument(_loggedInUserDocument)

      const roomDoc = await getDoc(roomDocumentReference)
      if (!roomDoc) throw new Error("No room document to create chat!")
      const _room = roomSchema.parse(roomDoc.data())
      setRoomDocument(_room)
      const userId = _room.users.filter((val) => {
        return val !== loggedInUserID
      })[0]
      setUserID(userId)
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
      createChatPushMessage(
        loggedInUserID ?? "",
        userID ?? "",
        roomDocument?.petID ?? "",
        newMessages[0].text,
        firebaseApp,
      ).then((pushMessage) => sendPushNotification(pushMessage))
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages),
      )
    },
    [firebaseApp],
  )

  return (
    <>
      <Text>
        luid: {loggedInUserID ?? ""}
        uid: {userID ?? ""}
        pid: {roomDocument?.petID ?? ""}
      </Text>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: loggedInUserID ?? 0,
          name: loggedInUserDocument?.person.fullName ?? "null",
          avatar: loggedInUserDocument?.person.pictureURL,
        }}
      />
    </>
  )
}
