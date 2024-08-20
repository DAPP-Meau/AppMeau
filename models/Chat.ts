import z from "zod"

export const roomSchema = z.object({
  users: z.array(z.string()).min(2),
  petID: z.string()
})

export type Room = z.infer<typeof roomSchema>

export const messageSchema = z.object({
  
})
