import { FirebaseApp } from "firebase/app"
import { addDoc, collection, doc, getFirestore, serverTimestamp } from "firebase/firestore"
import { IMessage } from "react-native-gifted-chat"
import * as Crypto from "expo-crypto"
import getCurrentUserUID from "@/utils/getCurrentUser"
import getUserAction from "../user/getUserAction"
import { Room, Snapshot } from "@/models"
import getPetAction from "../pet/getPetAction"
import { collectionPaths } from "@/constants"

export default async function sendAcceptMessage(
  room: Snapshot<Room>,
  firebaseApp: FirebaseApp,
): Promise<void> {
  const loggedInUser = getCurrentUserUID(firebaseApp)
  if (!loggedInUser)
    throw new Error("No user logged in to execute sendAcceptMessage.")
  const userDocument = await getUserAction(loggedInUser, firebaseApp)
  const petData = await getPetAction(room.data.petID, firebaseApp)
  const msg: IMessage = {
    _id: 'sendAcceptMessage',//possivelmete deveriamos setar um ID unico pois essa mensagem so estara uma unica vez em cada chat
    text: `${petData?.animal.name} foi liberado para sua adoção você aceita?`,    
    createdAt: serverTimestamp(), // Erro esperado
    user: {
      _id: loggedInUser ?? 0,
      name: userDocument?.person.fullName ?? "null",
      avatar: userDocument?.person.pictureURL,
    },
    buttons: true, // Indicador para renderizar botões
  }

    // Enviar a mensagem para o Firestore
    const db = getFirestore(firebaseApp)
    const roomDocumentReference = doc(
      db,
      collectionPaths.rooms,
      room.id,
    )
    const messagesCollectionReference = collection(
      roomDocumentReference,
      collectionPaths.rooms_messages,
    )
    await addDoc(messagesCollectionReference, msg);
  //TODO: enviar msg para o chat
  // TODO: adicionar documento msg na coleção de mensagens de room
}
