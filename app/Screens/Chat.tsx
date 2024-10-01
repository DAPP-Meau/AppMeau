import { StackScreenProps } from "@react-navigation/stack"
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react"
import {
  Bubble,
  GiftedChat,
  IMessage,
  MessageProps,
} from "react-native-gifted-chat"
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
  updateDoc,
  deleteDoc,
  where,
  getDocs,
  deleteField,
} from "firebase/firestore"
import { FirebaseAppContext } from "@/services/store/firebaseAppContext"
import { collectionPaths } from "@/constants"
import { Room, roomSchema } from "@/models"
import { LoggedInUserContext } from "@/services/store/LoggedInUserContext"
import { createChatPushMessage } from "@/services/api/messaging/createPushMessage"
import sendPushNotification from "@/services/api/messaging/sendPushNotification"
import { View, Text, StyleSheet, Alert } from "react-native"
import getPetAction from "@/services/api/pet/getPetAction"
import { Button, MD3Theme, useTheme } from "react-native-paper"

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
  const [roomID, setRoomId] = useState<string>()
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
    async function callback() {
      // Encontrar documento da sala
      const roomDoc = await getDoc(roomDocumentReference)
      if (!roomDoc) throw new Error("No room document to create chat!")
      const _room = roomSchema.parse(roomDoc.data())
      setRoomDocument(_room)
      setRoomId(roomDoc.id)

      // Encontrar usuário com o qual está conversando
      const userId = _room.users.filter((val) => {
        return val !== loggedInUser?.id
      })[0]
      setUserID(userId)
    }

    callback()
  }, [navigation])

  // Event Listener de mensagens novas do firebase.
  useEffect(() => {
    const q = query(
      messagesCollectionReference,
      orderBy("createdAt", "desc"),
      limit(100),
    )
    // Possível optimização: pegar mensagens iniciais com uma requisição normal
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

  async function resetPetUsersLists(petID: string) {
    const petDocumentReference = doc(db, collectionPaths.pets, petID)

    // Remove the 'Interested' field from the document
    await updateDoc(petDocumentReference, {
      interestedUsersList: deleteField(),
      rejectedUsersList: deleteField(),
    })
  }

  async function updatePetOwner(petID: string, newOwnerID: string) {
    const petRef = doc(db, "pets", petID)
    await updateDoc(petRef, {
      owner_uid: newOwnerID,
    })
  }

  async function updatePetAdoptionStatus(petID: string, status: boolean) {
    const petRef = doc(db, "pets", petID)
    await updateDoc(petRef, {
      adoptionRequest: status,
    })
  }

  async function deleteMessageById(messageId: string) {
    const q = query(messagesCollectionReference, where("_id", "==", messageId))
    const querySnapshot = await getDocs(q)
    querySnapshot.docs.map(async (doc) => {
      await deleteDoc(doc.ref)
    })
  }

  async function deleteAllChatsOfPet(petID: string) {
    const roomsCollectionReference = collection(db, collectionPaths.rooms)
    const q = query(roomsCollectionReference, where("petID", "==", petID))
    const querySnapshot = await getDocs(q)
    await Promise.all(
      querySnapshot.docs.map((doc) => {
        return deleteDoc(doc.ref)
      }),
    )
  }

  const handleResponse = async (response: "SIM" | "NÃO") => {
    const petData = await getPetAction(roomDocument?.petID ?? "", firebaseApp)
    const dono = petData?.owner_uid

    if (!petData) {
      Alert.alert("Erro ao obter dados do pet")
      return
    }

    // Verifica se o dono do pet não está tentando aceitar a própria solicitação
    if (loggedInUser?.id === dono) {
      Alert.alert("Aguarde a resposta!")
      return
    }

    if (response === "SIM") {
      // Lógica quando a resposta for SIM
      try {
        // TODO: Fazer a troca de usuários
        // Exemplo: Atualizar o `owner_uid` do pet para o `loggedInUser?.id`
        await updatePetOwner(roomDocument?.petID ?? "", loggedInUser?.id ?? "")

        // Definir a solicitação de adoção como False no pet
        await updatePetAdoptionStatus(roomDocument?.petID ?? "", false)

        //ajustar para essa funcionar
        // Remover a mensagem de "SIM/NÃO" após a confirmação
        await deleteMessageById("sendAcceptMessage")

        //Deletar todas as salas que tenham o pet_id
        await deleteAllChatsOfPet(roomDocument?.petID ?? "")

        // zerando os dados do pet
        await resetPetUsersLists(roomDocument?.petID ?? "")

        Alert.alert("Seu novo pet já está em seu domínio")

        navigation.goBack()
      } catch (error) {
        console.error("Erro ao aceitar a adoção:", error)
        Alert.alert("Erro ao processar a adoção.")
      }
    } else if (response === "NÃO") {
      // Lógica quando a resposta for NÃO
      try {
        // Definir a solicitação de adoção como False no pet
        await updatePetAdoptionStatus(roomDocument?.petID ?? "", false)

        //ajustar para essa funcionar
        // Remover a mensagem de "SIM/NÃO" após a recusa
        await deleteMessageById("sendAcceptMessage")

        Alert.alert("O pet não foi transferido para você")
      } catch (error) {
        console.error("Erro ao recusar a adoção:", error)
        Alert.alert("Erro ao processar a recusa.")
      }
    }
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: loggedInUser?.id ?? 0,
        name: loggedInUser?.data.person.fullName ?? "null",
        avatar: loggedInUser?.data.person.pictureURL,
      }}
      renderMessage={(message) => (
        <RenderMessageWithButtons
          message={message}
          onResponse={handleResponse}
        />
      )}
    />
  )
}

// Componente de bolha de chat customizado
interface IRMB {
  message: Readonly<MessageProps<IMessage>>
  onResponse: (response: "SIM" | "NÃO") => void
}

function RenderMessageWithButtons({ message, onResponse }: IRMB) {
  const { currentMessage: _current } = message
  const currentMessage = _current as IMessage & { buttons: boolean }
  const loggedInUser = useContext(LoggedInUserContext)

  const theme = useTheme()
  const styles = makeTheme(theme)

  const [leftSide, setLeftSide] = useState(false)
  useMemo(() => {
    setLeftSide(currentMessage.user._id !== loggedInUser?.id)
  }, [message])

  if (currentMessage)
    return (
      <View style={{ margin: 10 }}>
        {currentMessage.buttons ? (
          <>
            {leftSide ? (
              <View style={[styles.messageContainer, styles.alignLeft]}>
                <Text style={styles.messageTitle}>{currentMessage.text}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly", // Distribui os botões igualmente
                    marginTop: 10, // Espaço adicional no topo
                  }}
                >
                  <Button
                    style={styles.messageButton}
                    onPress={() => onResponse("SIM")}
                  >
                    <Text style={styles.buttonText}>SIM</Text>
                  </Button>
                  <Button
                    style={styles.messageButton}
                    onPress={() => onResponse("NÃO")}
                  >
                    <Text style={styles.buttonText}>NÃO</Text>
                  </Button>
                </View>
              </View>
            ) : (
              <View style={[styles.messageContainer, styles.alignRight]}>
                <Text>
                  Pronto para doar. Espere a resposta do outro usuário.
                </Text>
              </View>
            )}
          </>
        ) : (
          <Bubble {...message} />
        )}
      </View>
    )
}

const makeTheme = (theme: MD3Theme) =>
  StyleSheet.create({
    messageContainer: {
      padding: 20,
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      shadowColor: "#000", // Sombra para dar profundidade
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, // Para sombra em Android
      width: "75%", // Define um limite de largura para a mensagem (75% da tela)
    },
    alignLeft: {
      alignSelf: "flex-start",
    },
    alignRight: {
      alignSelf: "flex-end",
    },
    messageTitle: {
      fontSize: 18, // Aumenta o tamanho da fonte para melhorar a leitura
      marginBottom: 15, // Espaço maior entre o texto e os botões
      color: theme.colors.background,
      fontWeight: "bold", // Torna o texto mais destacado
      textAlign: "center", // Centraliza o texto
    },
    messageButton: {
      backgroundColor: theme.colors.primaryContainer,
      shadowColor: "#000", // Sombra para dar profundidade
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonText: {
      color: theme.colors.backdrop,
      fontSize: 16,
      fontWeight: "600", // Negrito para destaque
    },
  })
