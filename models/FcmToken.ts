import {z} from "zod"

export const deviceTokenSchema = z.object({
  token: z.string(),
  timestamp: z.date()
})

export type DeviceToken = z.infer<typeof deviceTokenSchema>
