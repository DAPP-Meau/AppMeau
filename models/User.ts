import { z } from "zod"

export const personSchema = z.object({
  fullName: z.string(),
  age: z.coerce.number().nonnegative(),
  phone: z.string(),
  pictureURL: z.string(),
})

export type Person = z.infer<typeof personSchema>

export const addressSchema = z.object({
  state: z.string(),
  city: z.string(),
  fullAddress: z.string(),
})

export type Address = z.infer<typeof addressSchema>

export const loginSchema = z.object({
  username: z.string(),
  email: z.string(),
})

export type Login = z.infer<typeof loginSchema>

export const userDocumentSchema = z.object({
  person: personSchema,
  address: addressSchema,
  login: loginSchema,
})

/** Usado para armazenamento de dados do usuário no Firestore */
export type UserDocument = z.infer<typeof userDocumentSchema>
