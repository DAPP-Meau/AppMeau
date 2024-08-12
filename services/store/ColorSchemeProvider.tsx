import React, { ReactNode } from "react"
import { ColorSchemeContext, ColorSchemeContextProps } from "@/services/store/ColorSchemeContext"

interface Props {
  value: ColorSchemeContextProps
  children: ReactNode
}

export default function ColorSchemeProvider({ value, children }: Props) {
  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  )
}
