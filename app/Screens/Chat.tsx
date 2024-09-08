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
import { useTheme } from "react-native-paper"

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
    if (response == 'SIM') {
      //verifica possivel erro de o dono do pet clicar em SIM e contabilizar aqui
      const petData = await getPetAction(roomDocument?.petID ?? '', firebaseApp);
      const dono = petData?.owner_uid;
      if (loggedInUser?.id != dono) {
        //TODO: fazer a troca de usuarios
        //setar solicitação de adoção como False no pet
        //remover a mensagem de sim e não (pode deletar ela)
        Alert.alert('Seu novo pet ja esta em seu dominio');
      }
      else {
        Alert.alert(`Aguarde a resposta!`);
      };
    }
    else {
      const petData = await getPetAction(roomDocument?.petID ?? '', firebaseApp);
      const dono = petData?.owner_uid;
      if (loggedInUser?.id != dono) {
        //TODO: fazer a troca de usuarios
        //setar solicitação de adoção como False no pet
        //remover a mensagem de sim e não (pode deletar ela)
        Alert.alert('O pet não foi transferido para você');
      }
      else {
        Alert.alert(`Aguarde a resposta!`);
      };
    };

    const newMessage: IMessage = {
      _id: Math.random().toString(), //Crypto.randomUUID()
      text: `${response}`,
      createdAt: serverTimestamp(),// esta com erro!
      user: {
        _id: loggedInUser?.id ?? 0,
        name: loggedInUser?.data.person.fullName ?? "null",
        avatar: loggedInUser?.data.person.pictureURL,
      },
    };
    setMessages((previousMessages) => GiftedChat.append(previousMessages, [newMessage]));
  };
  const theme = useTheme()
  const renderMessageWithButtons = (props) => {
    const { currentMessage } = props;

    if (currentMessage.buttons) {
      return (
        <View style={{
          padding: 20,
          backgroundColor: theme.colors.primary,
          borderRadius: 10,
          shadowColor: '#000',  // Sombra para dar profundidade
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,  // Para sombra em Android
          maxWidth: '75%',  // Define um limite de largura para a mensagem (75% da tela)
          alignSelf: 'center', // Garante que a mensagem fique alinhada como em chats convencionais
        }}>
          <Text style={{
            fontSize: 18, // Aumenta o tamanho da fonte para melhorar a leitura
            marginBottom: 15, // Espaço maior entre o texto e os botões
            color: theme.colors.background,
            fontWeight: 'bold', // Torna o texto mais destacado
            textAlign: 'center', // Centraliza o texto
          }}>
            {currentMessage.text}
          </Text>
        
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly', // Distribui os botões igualmente
            marginTop: 10, // Espaço adicional no topo
          }}>
            <TouchableOpacity style={{
              paddingVertical: 10,
              paddingHorizontal: 25,
              backgroundColor: theme.colors.primaryContainer,
              borderRadius: 25, // Botões mais arredondados
              shadowColor: '#000', // Sombra para dar profundidade
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }} onPress={() => handleResponse('SIM')}>
              <Text style={{
                color: theme.colors.backdrop,
                fontSize: 16,
                fontWeight: '600', // Negrito para destaque
              }}>
                SIM
              </Text>
            </TouchableOpacity>
        
            <TouchableOpacity style={{
              paddingVertical: 10,
              paddingHorizontal: 25,
              backgroundColor: theme.colors.primaryContainer,
              borderRadius: 25, // Botões mais arredondados
              shadowColor: '#000', // Sombra para dar profundidade
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }} onPress={() => handleResponse('NÃO')}>
              <Text style={{
                color: theme.colors.backdrop,
                fontSize: 16,
                fontWeight: '600', // Negrito para destaque
              }}>
                NÃO
              </Text>
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


