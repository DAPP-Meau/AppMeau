import { PetDocument, UserDocument } from "../models"

export function boolToSimNao(b: boolean) {
  return b ? "Sim" : "Não"
}

export const machoFemea = (pet: PetDocument) => {
  switch (pet.animal.sex) {
    case "female":
      return "Fêmea"
    case "male":
      return "Macho"
  }
}

export const tamanho = (pet: PetDocument) => {
  switch (pet.animal.size) {
    case "large":
      return "Grande"
    case "medium":
      return "Médio"
    case "small":
      return "Pequeno"
  }
}

export const idade = (pet: PetDocument) => {
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

export const temperamento = (pet: PetDocument): string => {
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

export const exigências = (pet: PetDocument): string => {
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

export const endereco = ({ address }: UserDocument): string => {
  const { fullAddress, city, state } = address
  return fullAddress + " - " + city + ", " + state
}
