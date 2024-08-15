import { Pet } from "./Pet";
import { User } from "./User";

export * from "./Pet"
export * from "./User"
export * from "./Chat"

export type Snapshot<T> = { id: string; data: T }

export type PetAndOwnerDocument = {
  pet: Snapshot<Pet>
  user: Snapshot<User>
}
