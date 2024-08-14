import { IMessage } from "react-native-gifted-chat"
import z from "zod"

export const roomDocumentSchema = z.object({
  users: z.array(z.string()).min(2)
})

export type RoomDocument = z.infer<typeof roomDocumentSchema>

export const messageDocumentSchema = z.object({
  
})

export type MessageDocument = IMessage