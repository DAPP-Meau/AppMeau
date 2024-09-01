import { Pet, User } from "../models"

export function boolToSimNao(b: boolean) {
  return b ? "Sim" : "Não"
}

export const machoFemea = (pet: Pet) => {
  switch (pet.animal.sex) {
    case "female":
      return "Fêmea"
    case "male":
      return "Macho"
  }
}

export const tamanho = (pet: Pet) => {
  switch (pet.animal.size) {
    case "large":
      return "Grande"
    case "medium":
      return "Médio"
    case "small":
      return "Pequeno"
  }
}

export const idade = (pet: Pet) => {
  switch (pet.animal.age) {
    case "adult":
      return "Adulto"
    case "cub":
      return "Filhote"
    case "old":
      return "Idoso"
  }
}

export function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1)
}

/** A partir de uma lista de strings, adiciona pontos e virgulas entre
 * elementos e "e" entre os últimos dois elementos.
 */
export function createTextFromList<T>(
  list: Array<T>,
  emptyMsg: string,
  separator = ", ",
) {
  return capitalize(
    list
      .filter((x) => x && x !== "") // Filtrar apenas as opções possíveis
      .flatMap((val, i, arr) => {
        // Colocar vírgulas e "e" no final da frase
        if (i < arr.length - 2) {
          return [val, separator]
        } else if (i <= arr.length - 2) {
          return [val, " e "]
        } else {
          return val
        }
      })
      .join("") || emptyMsg, // Mesclar numa string ou mostrar emptyMsg
  ) // Capitalizar primeiro caractere
}

export const temperamento = (pet: Pet): string => {
  return createTextFromList(
    [
      pet.temperament.calm ? "calmo" : "",
      pet.temperament.guard ? "guarda" : "",
      pet.temperament.lazy ? "preguiçoso" : "",
      pet.temperament.loving ? "amoroso" : "",
      pet.temperament.playful ? "brincalhão" : "",
      pet.temperament.shy ? "tímido" : "",
    ],
    "nenhum!",
  )
}

export const exigências = (pet: Pet): string => {
  const {
    requireAdoptionTerm,
    requireHousePhoto,
    requireMonitoring,
    requirePreviousVisit,
  } = pet.adoptionRequirements

  const stringNull = (b: boolean, s: string) => {
    if (b) {
      return s
    } else {
      return null
    }
  }

  return createTextFromList(
    [
      stringNull(requireAdoptionTerm, "Termo de adoção"),
      stringNull(requireHousePhoto, "fotos da casa"),
      stringNull(requirePreviousVisit, "visita prévia à casa"),
      stringNull(
        requireMonitoring !== 0,
        requireMonitoring + " meses de acompanhamento pós adoção",
      ),
    ],
    "nenhuma!",
  )
}

export const endereco = ({ address }: User): string => {
  const { fullAddress, city, state } = address
  return fullAddress + " - " + city + ", " + state
}

export const usuariosInteressados = (x: number): string => {
  if (x) {
    const s = x > 1 ? "s" : ""
    return x + " usuário" + s + " interessado" + s
  }
  return "Nenhum usuário interessado"
}

/**
 * Truca uma string caso seja muito grande e adiciona 3 pontos.
 *
 * @param s a string
 * @param length O tamanho a partir do qual em que a string será truncada. Padrão 20
 * @returns A string com três pontos no final caso seja maior que length
 */
export const elipsisIfLarge = (s: string, length: number = 20): string => {
  if (s.length < length) return s
  else return s.slice(0, length) + "..."
}

/**
 * Retorna os dois primeiros nomes de uma pessoa. Caso a pessoa contenha "Da" ou
 * outro segundo nome com 2 caracteres na string, inclui esse nome.
 * @param s O nome da pessoa
 * @returns Os dois primeiros nomes da pessoa
 * @example
 *   getFirstTwoNames("Joao Silva") = "Joao Silva"
 *   getFirstTwoNames("Joao da Silva") = "Joao da Silva"
 */
export const getFirstTwoNames = (s: string): string => {
  const splits = s.split(" ")
  let cutAt = 2
  if (splits.length >= 3 && splits[1].length === 2) {
    cutAt = 3
  }
  return splits.slice(0, cutAt).join(" ")
}
