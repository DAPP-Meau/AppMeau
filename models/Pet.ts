import z from "zod"
import { UserDocument } from "./User"

export const speciesOptionsEnum = z.enum(["cat", "dog"])
export const sexOptionsEnum = z.enum(["male", "female"])
export const sizeOptionsEnum = z.enum(["small", "medium", "large"])
export const ageOptionsEnum = z.enum(["cub", "adult", "old"])

export type speciesOptions = z.infer<typeof speciesOptionsEnum>
export type sexOptions = z.infer<typeof sexOptionsEnum>
export type sizeOptions = z.infer<typeof sizeOptionsEnum>
export type ageOptions = z.infer<typeof ageOptionsEnum>

export const animalSchema = z.object({
  name: z
    .string()
    .min(0, "O nome do seu pet está muito curto")
    .max(
      100,
      "O nome do seu pet está muito comprido, o máximo são 100 caracteres",
    ),
  species: speciesOptionsEnum,
  sex: sexOptionsEnum,
  size: sizeOptionsEnum,
  age: ageOptionsEnum,
  story: z
    .string()
    .max(
      256,
      "A história do seu pet está muito longa, o máximo são 256 caracteres.",
    )
    .optional(),
})

export type Animal = z.infer<typeof animalSchema>

export const temperamentSchema = z.object({
  playful: z.boolean(),
  shy: z.boolean(),
  calm: z.boolean(),
  guard: z.boolean(),
  loving: z.boolean(),
  lazy: z.boolean(),
})

export type Temperament = z.infer<typeof temperamentSchema>

export const healthSchema = z.object({
  vaccinated: z.boolean(),
  dewormed: z.boolean(),
  neutered: z.boolean(),
  sick: z.boolean(),
  sicknesses: z
    .string()
    .max(
      256,
      "A história do seu pet está muito longa, o máximo são 256 caracteres.",
    )
    .optional(),
})

export type Health = z.infer<typeof healthSchema>

export const adoptionRequirementsSchema = z.object({
  requireAdoptionTerm: z.boolean(),
  requireHousePhoto: z.boolean(),
  requireMonitoring: z.number().int().nonnegative(),
  requirePreviousVisit: z.boolean(),
})

export type AdoptionRequirements = z.infer<typeof adoptionRequirementsSchema>

export const petDocumentSchema = z.object({
  animal: animalSchema,
  temperament: temperamentSchema,
  health: healthSchema,
  adoptionRequirements: adoptionRequirementsSchema,
  interestedUsersList: z.array(z.string()).optional(),
  owner_uid: z.string(),
  picture_url: z.string(),
})

export type PetDocument = z.infer<typeof petDocumentSchema>

export type PetAndOwnerDocument = {
  pet: { id: string; data: PetDocument }
  user: { id: string; data: UserDocument }
}

export type GetPetListActionReturn = Array<PetAndOwnerDocument>
