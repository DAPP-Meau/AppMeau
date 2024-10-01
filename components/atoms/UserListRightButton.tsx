import React from "react"
import getRoomWithUserAction from "@/services/api/chat/getRoomAction"
import { FirebaseApp } from "firebase/app"
import { Text } from "react-native"
import { Button } from "react-native-paper"

export interface IUserListRightButtonProps {
  navigation: any
  userID: string
  petID: string
  chatExists: boolean
  firebaseApp: FirebaseApp
}

export function UserListRightButton({
  navigation,
  userID,
  petID,
  firebaseApp,
  chatExists
}: IUserListRightButtonProps) {

  return (
    <Button
      mode={chatExists ? "outlined" : "contained"}
      compact
      onPress={async () => {
        const room = await getRoomWithUserAction(userID, petID, firebaseApp)
        navigation.navigate("chat", { roomId: room.id })
      }}
    >
      <Text>{chatExists ? "Continuar conversa" : "Iniciar conversa"}</Text>
    </Button>
  )
}
