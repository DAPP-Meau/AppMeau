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

/** Usado no formulário */
export interface PetRegistrationFields {
  animal: Animal
  health: Health
  temperament: Temperament
  adoptionRequirements: AdoptionRequirements
  imageURI: string
}

/** Usado para armazenamento no Firebase Database */
export type PetRegistrationDocument = Omit<PetRegistrationFields, "imageURI">

// guardas de tipo ------------------------------------------------------------

export function isSpeciesOptions(value: unknown): value is speciesOptions {
  if (value === "cat" || value === "dog") return true
  return true
}

export function isSexOptions(value: unknown): value is sexOptions {
  if (value === "male" || value === "female") return true
  return false
}

export function isSizeOptions(value: unknown): value is sizeOptions {
  if (value === "small" || value === "medium" || value === "large") return true
  return false
}

export function isAgeOptions(value: unknown): value is ageOptions {
  if (value === "cub" || value === "adult" || value === "old") return true
  return false
}

export function isAnimal(value: unknown): value is Animal {
  //Verificar se value Existe e é um objeto
  if (!value) return false
  if (typeof value !== "object") return false
  //Verificar se tem o prop
  if (!("name" in value && typeof value.name === "string")) return false
  if (!("species" in value && isSpeciesOptions(value.species))) return false
  if (!("sex" in value && isSexOptions(value.sex))) return false
  if (!("size" in value && isSizeOptions(value.size))) return false
  if (!("age" in value && isAgeOptions(value.age))) return false
  if (!("owner_uid" in value && typeof value.owner_uid === "string"))
    return false
  if (!("picture_uid" in value && typeof value.picture_uid === "string"))
    return false

  if ("story" in value) {
    if (typeof value.story !== "string") return false
  }

  return true
}

export function isTemperament(value: unknown): value is Temperament {
  if (!value) return false
  if (typeof value !== "object") return false

  if (!("playful" in value && typeof value.playful === "boolean")) return false
  if (!("shy" in value && typeof value.shy === "boolean")) return false
  if (!("calm" in value && typeof value.calm === "boolean")) return false
  if (!("guard" in value && typeof value.guard === "boolean")) return false
  if (!("loving" in value && typeof value.loving === "boolean")) return false
  if (!("lazy" in value && typeof value.lazy === "boolean")) return false

  return true
}

export function isHealth(value: unknown): value is Health {
  if (!value) return false
  if (typeof value !== "object") return false

  if (!("vaccinated" in value && typeof value.vaccinated === "boolean"))
    return false
  if (!("dewormed" in value && typeof value.dewormed === "boolean"))
    return false
  if (!("neutered" in value && typeof value.neutered === "boolean"))
    return false
  if (!("sick" in value && typeof value.sick === "boolean")) return false

  if ("sicknesses" in value) {
    if (typeof value.sicknesses !== "string") return false
  }

  return true
}

export function isAdoptionRequirements(
  value: unknown,
): value is AdoptionRequirements {
  if (!value) return false
  if (typeof value !== "object") return false

  if (!("requireAdoptionTerm" in value && typeof value.requireAdoptionTerm === "boolean")) return false
  if (!("requireHousePhoto" in value && typeof value.requireHousePhoto === "boolean")) return false
  if (!("requireMonitoring" in value && typeof value.requireMonitoring === "boolean")) return false
  if (!("requirePreviousVisit" in value && typeof value.requirePreviousVisit === "boolean")) return false

  return true
}

export function isPetRegistrationDocument(
  value: unknown,
): value is PetRegistrationDocument {
  if (!value) return false
  if (typeof value !== "object") return false

  if (!("animal" in value && isAnimal(value.animal))) return false
  if (!("health" in value && isHealth(value.health))) return false
  if (!("temperament" in value && isTemperament(value.temperament))) return false
  if (!("adoptionRequirements" in value && isAdoptionRequirements(value.adoptionRequirements))) return false

  return true
}

export function isPetRegistrationFields(
  value: unknown,
): value is PetRegistrationFields {
  if (!isPetRegistrationDocument(value)) return false
  if (!("imageURI" in value && typeof value.imageURI === "string")) return false
  
  return true
}


