/**
 *
 * @param list in
 * @param value
 */
export function listRemove<T>(list: Array<T> | undefined, value: T): Array<T> {
  if (!list) {
    // Caso não exista lista, crie uma lista
    list = []
  } else {
    // Caso exista, apenas remova
    list = list.filter((element) => {
      return element !== value
    })
  }
  return list
}

/**
 * Insira valor na lista caso ela seja diferente de undefined
 *
 * @param list lista a ser trabalhada
 * @param value valor a ser inserido
 */
export function listUnion<T>(list: Array<T> | undefined, value: T) {
  if (list) {
    list.push(value)
  } else {
    list = [value]
  }

  return list
}
