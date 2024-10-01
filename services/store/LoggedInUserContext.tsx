import { Snapshot, User } from "@/models"
import { createContext } from "react"

/**
 * Contexto que armazena Snapshot com dados do usuário logado
 */
export const LoggedInUserContext = createContext<Snapshot<User> | null>(null)
