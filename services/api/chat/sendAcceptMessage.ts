import { FirebaseApp } from "firebase/app"
import { serverTimestamp } from "firebase/firestore"
import { IMessage } from "react-native-gifted-chat"
import * as Crypto from "expo-crypto"
import getCurrentUserUID from "@/utils/getCurrentUser"
import getUserAction from "../user/getUserAction"
import { Room, Snapshot } from "@/models"
import getPetAction from "../pet/getPetAction"

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
    _id: Crypto.randomUUID(),
    text: `${petData?.animal.name} foi liberado para sua adoção você aceita?`,    
    createdAt: serverTimestamp(), // Erro esperado
    user: {
      _id: loggedInUser ?? 0,
      name: userDocument?.person.fullName ?? "null",
      avatar: userDocument?.person.pictureURL,
    },
    buttons: true, // Indicador para renderizar botões
  }
  //TODO: enviar msg para o chat
  // TODO: adicionar documento msg na coleção de mensagens de room
}
