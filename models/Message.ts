export type PushMessage = {
  to: string
  title: string
  body: string
  priority: "default" | "normal" | "high"
  data?: any // TODO: Definir tipo melhor { someData: "goes here" }
}
