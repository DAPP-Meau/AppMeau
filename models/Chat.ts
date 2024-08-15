import { IMessage, User } from "react-native-gifted-chat"
import z from "zod"

export const roomSchema = z.object({
  users: z.array(z.string()).min(2)
})

export type Room = z.infer<typeof roomSchema>

export const messageSchema = z.object({
  
})
