import { User } from "firebase/auth"
import { createContext } from "react"

export const LoggedInUserContext = createContext<User | null>(null)
