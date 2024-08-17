import React, { ReactNode, useContext, useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { ColorSchemeContext, ColorSchemes } from "@/services/store/ColorSchemeContext"

interface ColorSchemeComponentProps {
  theme: ColorSchemes
  children?: ReactNode
}

/** Muda o contexto ColorSchemeContext para `theme` quando a tela é montada,
 * quando ela sai do foco, ela muda para o tema anterior.
 *
 * @param theme Esquema de cores selecionado
 * @returns ReactNode
 */
export function ScreenColorScheme({
  theme,
  children,
}: ColorSchemeComponentProps) {
  /* Estamos usando useEffect nesse component ao invés de useFocusEffect do
   * react navigation porque segundo a documentação em
   * https://reactnavigation.org/docs/use-focus-effect/#when-to-use-focus-and-blur-events-instead
   * a função de limpeza do useFocusEffect não foi feita para fazer algo durante
   * o blur.
   */
  const navigation = useNavigation()
  const colorScheme = useContext(ColorSchemeContext)
  // O valor padrão do app é yellow, caso não tenha um tema anterior.
  const [oldScheme, setOldScheme] = useState<ColorSchemes>("yellow")

  // Event Listener de quando a tela entra em foco, trocando para o tema
  // selecionado.
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setOldScheme(colorScheme.colorScheme)
      colorScheme.setColorScheme(theme)
    })
    return unsubscribe
  }, [navigation])

  // Event Listener de quando a tela sai, trocando para o tema anterior.
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      colorScheme.setColorScheme(oldScheme)
    })
    return unsubscribe
  }, [navigation])

  return children ?? null
}

interface ColorScreenProps {
  children?: ReactNode
}

/**
 * Configura uma tela para usar o Tema amarelo. Deve ser usado em 
 * funcionalidades principais do app, como cadastro e adoção de animais.
 *
 * É necessário ter um ColorSchemeProvider na
 * arvore react.
 *
 * @example
 * import { Button, Text } from "react-native-paper"
 * import { YellowColorScreen } from "./ScreenColorScheme"
 *
 * export default function Hello() {
 *  return (
 *    <>
 *      <YellowColorScreen />
 *      <Text>Você já tem conta?</Text>
 *      <Button mode="outlined">
 *        <Text>Faça seu login</Text>
 *      </Button>
 *    </>
 *  )
 * }
 */
export function YellowColorScreen({ children }: ColorScreenProps) {
  return (
    <ScreenColorScheme theme="yellow">{children ?? null}</ScreenColorScheme>
  )
}

/**
 * Configura uma tela para usar o Tema azul. Deve ser usado em 
 * funcionalidades secundárias do app, como cadastro de usuário, informações e
 * dicas e edição de dados.
 *
 * É necessário ter um ColorSchemeProvider na
 * arvore react.
 *
 * @example
 * import { Button, Text } from "react-native-paper"
 * import { YellowColorScreen } from "./ScreenColorScheme"
 *
 * export default function Hello() {
 *  return (
 *    <>
 *      <BlueColorScreen />
 *      <Text>Você já tem conta?</Text>
 *      <Button mode="outlined">
 *        <Text>Faça seu login</Text>
 *      </Button>
 *    </>
 *  )
 * }
 */
export function BlueColorScreen({ children }: ColorScreenProps) {
  return <ScreenColorScheme theme="blue">{children ?? null}</ScreenColorScheme>
}
