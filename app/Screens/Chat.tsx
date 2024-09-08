import { StackScreenProps } from "@react-navigation/stack"
import React, { useState, useEffect, useContext, useCallback } from "react"
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat"
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
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import getPetAction from "@/services/api/pet/getPetAction"

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


  const handleResponse = async (response) => {
    if (response=='SIM'){
      //verifica possivel erro de o dono do pet clicar em SIM e contabilizar aqui
      const petData = await getPetAction(roomDocument?.petID, firebaseApp);
      const dono = petData?.owner_uid;
      if (loggedInUser?.id != dono){
          //TODO: fazer a troca de usuarios
          Alert.alert('Seu novo pet ja esta em seu dominio');
      };
    };
    const newMessage = {
      _id: Math.random().toString(), //Crypto.randomUUID()
      text: `${response}`,
      createdAt: serverTimestamp(),
      user:{
        _id: loggedInUser?.id ?? 0,
        name: loggedInUser?.data.person.fullName ?? "null",
        avatar: loggedInUser?.data.person.pictureURL,
      },
    };
    setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
  };
  const renderMessageWithButtons = (props) => {
    const { currentMessage } = props;

    if (currentMessage.buttons) {
      return (
        <View style={styles.buttonMessageContainer}>
          <Text style={styles.messageText}>{currentMessage.text}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleResponse('SIM')}>
              <Text style={styles.buttonText}>SIM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleResponse('NÃO')}>
              <Text style={styles.buttonText}>NÃO</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return <Bubble {...props} />;
  };
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: loggedInUser?.id ?? 0,
        name: loggedInUser?.data.person.fullName ?? "null",
        avatar: loggedInUser?.data.person.pictureURL,
      }}
      renderMessage={renderMessageWithButtons}
    />
  )
}

const styles = StyleSheet.create({
  buttonMessageContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

