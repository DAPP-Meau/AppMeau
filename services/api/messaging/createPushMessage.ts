import { PushMessage } from "@/models/Message"
import { FirebaseApp } from "firebase/app"
import getUserAction from "../user/getUserAction"
import getPetAction from "../pet/getPetAction"
import { retrieveToken } from "./retrieveToken"
import { elipsisIfLarge, getFirstTwoNames } from "@/utils/strings"

/* TODO: As funções de criar mensagens createInterestedPushMessage e
 * createChatPushMessage são funções que poderiam ser extraídas e colocadas
 * em um builder de PushMessage, pra deixar mais versátil a criação de
 * pushMessages do aplicativo e poder re-utilizar código. O primeiro desafio
 * disso é descobrir como criar um builder com passos asíncronos.
 */

export async function createInterestedPushMessage(
  loggedInUserUID: string,
  userID: string,
  petID: string,
  firebaseApp: FirebaseApp,
): Promise<PushMessage> {
  const user = await getUserAction(loggedInUserUID, firebaseApp)
  if (!user) throw new Error("No user document to create Push message.")
  const pet = await getPetAction(petID, firebaseApp)
  if (!pet) throw new Error("No pet to set message to.")
  const token = await retrieveToken(userID, firebaseApp)
  if (!token) throw new Error("User has no token to send message")

  const title = "Novo usuário interessado em seu pet"
  const body =
    getFirstTwoNames(user.person.fullName) +
    " Está interessado no seu pet: " +
    pet.animal.name

  const message: PushMessage = {
    to: token.token,
    title: title,
    body: body,
    priority: "normal",
  }

  console.log("message body: " + JSON.stringify(message))
  return message
}

export async function createChatPushMessage(
  loggedInUserUID: string,
  userID: string,
  petID: string,
  chatMessage: string,
  firebaseApp: FirebaseApp,
): Promise<PushMessage> {
  const loggedInUser = await getUserAction(loggedInUserUID, firebaseApp)
  if (!loggedInUser) throw new Error("No user document to create Push message.")
  const pet = await getPetAction(petID, firebaseApp)
  if (!pet) throw new Error("No pet to set message to.")
  const token = await retrieveToken(userID, firebaseApp)
  if (!token) throw new Error("User has no token to send message")

  const title =
    "Você recebeu uma mensagem de " + getFirstTwoNames(loggedInUser.person.fullName)
  const body =
    "Chat no seu pet " + pet.animal.name + ": " + elipsisIfLarge(chatMessage)

  const message: PushMessage = {
    to: token.token,
    title: title,
    body: body,
    priority: "normal",
  }

  console.log("message body: " + JSON.stringify(message))
  return message
}