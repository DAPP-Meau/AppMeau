import { AdoptionRegistrationForm } from "./AdoptionRegistrationForm"

// createdBy é o userID que criou o registro de adoção
export type AdoptionStorageDocument = AdoptionRegistrationForm & {
  createdBy: string
}
