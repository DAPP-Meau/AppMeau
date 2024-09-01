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
import { Room, roomSchema } from "@/models"
import { LoggedInUserContext } from "@/services/store/LoggedInUserContext"
import { createChatPushMessage } from "@/services/api/messaging/createPushMessage"
import sendPushNotification from "@/services/api/messaging/sendPushNotification"

type Props = StackScreenProps<RootStackParamList, "chat">

export default function Chat({ route, navigation }: Props) {
  const firebaseApp = useContext(FirebaseAppContext)
  const db = getFirestore(firebaseApp)
  // Dados do do usuário logado
  const loggedInUser = useContext(LoggedInUserContext)
  // Id do usuário com qual estamos conversando
  const [userID, setUserID] = useState<string>()
  // Documento da sala
  const [roomDocument, setRoomDocument] = useState<Room>()
  // Mensagens exibidas na tela
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
    callback()

    async function callback() {
      // Encontrar documento da sala
      console.log("get room Doc")
      const roomDoc = await getDoc(roomDocumentReference)
      if (!roomDoc) throw new Error("No room document to create chat!")
      const _room = roomSchema.parse(roomDoc.data())
      console.log("setRoom")
      setRoomDocument(_room)
      // Encontrar usuário com o qual está conversando
      const userId = _room.users.filter((val) => {
        return val !== loggedInUser?.id
      })[0]
      console.log("setUserID")
      setUserID(userId)
      console.log("dados do useEffect: " + JSON.stringify({ _room }))
    }
  }, [navigation])

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
        // o documento chega ao servidor
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
      // Armazenar mensagens no firebase
      const storeNewMessages = async (newMessages: IMessage[]) => {
        const batch = newMessages.map((message) => {
          // Nós queremos substituir created at pelo horário que a mensagem chegou
          // no servidor.
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
        return Promise.all(batch)
      }

      await storeNewMessages(newMessages)

      // Enviar push notification
      if (loggedInUser?.id && userID && roomDocument) {
        createChatPushMessage(
          loggedInUser?.id,
          userID,
          roomDocument?.petID,
          newMessages[0].text,
          firebaseApp,
        ).then((pushMessage) => sendPushNotification(pushMessage))
      } else {
        console.error(
          "Faltam dados para enviar mensagem: " +
            JSON.stringify({
              logged_uid: loggedInUser?.id ?? "null",
              uid: userID ?? "null",
              room: roomDocument ?? "null",
            }),
        )
      }

      // Adicionar mensagens ao estado das mensagens
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages),
      )
    },
    [firebaseApp, loggedInUser, userID, roomDocument],
  )

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: loggedInUser?.id ?? 0,
        name: loggedInUser?.data.person.fullName ?? "null",
        avatar: loggedInUser?.data.person.pictureURL,
      }}
    />
  )
}
