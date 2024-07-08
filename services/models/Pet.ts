export type speciesOptions = "cat" | "dog"
export type sexOptions = "male" | "female"
export type sizeOptions = "small" | "medium" | "large"
export type ageOptions = "cub" | "adult" | "old"

export type Animal = {
  name: string
  species: speciesOptions
  sex: sexOptions
  size: sizeOptions
  age: ageOptions
  story?: string
  owner_uid: string
  picture_uid: string
}

export type Temperament = {
  playful: boolean
  shy: boolean
  calm: boolean
  guard: boolean
  loving: boolean
  lazy: boolean
}

export type Health = {
  vaccinated: boolean
  dewormed: boolean
  neutered: boolean
  sick: boolean
  sicknesses?: string
}

export type AdoptionRequirements = {
  requireAdoptionTerm: boolean
  requireHousePhoto: boolean
  requireMonitoring: boolean
  requirePreviousVisit: boolean
}

// Usado no formulário
export interface PetRegistrationFields {
  animal: Animal
  health: Health
  temperament: Temperament
  adoptionRequirements: AdoptionRequirements
}

// Usado para armazenamento no Firebase Database
export type PetRegistrationDocument = {
  animal: Animal
  health: Health
  temperament: Temperament
}
