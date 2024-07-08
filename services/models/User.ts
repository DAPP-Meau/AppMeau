export type Person = {
  fullName: string
  age: number
  phone: string
}

export type Address = {
  state: string
  city: string
  fullAddress: string
}

export type Login = {
  username: string
  email: string
  password: string
}

// Usado no formulário
export type UserRegistrationForm = {
  person: Person
  address: Address
  login: Login
}

// Usado para armazenamento no Firebase Database
export type UserRegistrationDocument = {
  person: Person
  address: Address
  login: Omit<Login, "password">
}
