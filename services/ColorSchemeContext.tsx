import { createContext } from "react"

export type ColorSchemes = "blue" | "yellow"

export type ColorSchemeContextProps = {
  colorScheme: ColorSchemes
  setColorScheme: (meauTheme: ColorSchemes) => void
}

export const ColorSchemeContext = createContext<ColorSchemeContextProps>({
  colorScheme: "yellow",
  setColorScheme: () => {},
})
