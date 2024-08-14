export * from "./Pet"
export * from "./User"
export * from "./Chat"

export type Snapshot<T> = { id: string; data: T }
