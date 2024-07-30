import { DefaultTheme } from "react-native-paper"
import { ThemeProp } from "react-native-paper/lib/typescript/types"

const yellowThemeColors = {
  "colors": {
    "primary": "rgb(236, 194, 72)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(255, 224, 143)",
    "onPrimaryContainer": "rgb(36, 26, 0)",
    "secondary": "rgb(117, 91, 0)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(255, 223, 146)",
    "onSecondaryContainer": "rgb(36, 26, 0)",
    "tertiary": "rgb(117, 91, 0)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(255, 223, 144)",
    "onTertiaryContainer": "rgb(36, 26, 0)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(255, 251, 255)",
    "onBackground": "rgb(117, 117, 117)",
    "surface": "rgb(255, 251, 255)",
    "onSurface": "rgb(30, 27, 22)",
    "surfaceVariant": "rgb(236, 225, 207)",
    "onSurfaceVariant": "rgb(76, 70, 57)",
    "outline": "rgb(126, 118, 103)",
    "outlineVariant": "rgb(207, 197, 180)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(51, 48, 42)",
    "inverseOnSurface": "rgb(247, 240, 231)",
    "inversePrimary": "rgb(117, 91, 0)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(248, 243, 242)",
      "level2": "rgb(244, 238, 235)",
      "level3": "rgb(240, 233, 227)",
      "level4": "rgb(238, 232, 224)",
      "level5": "rgb(236, 229, 219)"
    },
    "surfaceDisabled": "rgba(30, 27, 22, 0.12)",
    "onSurfaceDisabled": "rgba(30, 27, 22, 0.38)",
    "backdrop": "rgba(53, 48, 36, 0.4)"
    }
  }

const blueThemeColors = {
  "colors": {
    "primary": "rgb(0, 106, 97)",
    "onPrimary": "rgb(255, 255, 255)",
    "primaryContainer": "rgb(115, 248, 231)",
    "onPrimaryContainer": "rgb(0, 32, 29)",
    "secondary": "rgb(56, 107, 1)",
    "onSecondary": "rgb(255, 255, 255)",
    "secondaryContainer": "rgb(183, 244, 129)",
    "onSecondaryContainer": "rgb(13, 32, 0)",
    "tertiary": "rgb(71, 85, 182)",
    "onTertiary": "rgb(255, 255, 255)",
    "tertiaryContainer": "rgb(223, 224, 255)",
    "onTertiaryContainer": "rgb(0, 13, 95)",
    "error": "rgb(186, 26, 26)",
    "onError": "rgb(255, 255, 255)",
    "errorContainer": "rgb(255, 218, 214)",
    "onErrorContainer": "rgb(65, 0, 2)",
    "background": "rgb(250, 253, 251)",
    "onBackground": "rgb(25, 28, 27)",
    "surface": "rgb(250, 253, 251)",
    "onSurface": "rgb(25, 28, 27)",
    "surfaceVariant": "rgb(218, 229, 226)",
    "onSurfaceVariant": "rgb(63, 73, 71)",
    "outline": "rgb(111, 121, 119)",
    "outlineVariant": "rgb(190, 201, 198)",
    "shadow": "rgb(0, 0, 0)",
    "scrim": "rgb(0, 0, 0)",
    "inverseSurface": "rgb(45, 49, 48)",
    "inverseOnSurface": "rgb(239, 241, 239)",
    "inversePrimary": "rgb(82, 219, 203)",
    "elevation": {
      "level0": "transparent",
      "level1": "rgb(238, 246, 243)",
      "level2": "rgb(230, 241, 239)",
      "level3": "rgb(223, 237, 234)",
      "level4": "rgb(220, 235, 233)",
      "level5": "rgb(215, 232, 229)"
    },
    "surfaceDisabled": "rgba(25, 28, 27, 0.12)",
    "onSurfaceDisabled": "rgba(25, 28, 27, 0.38)",
    "backdrop": "rgba(41, 50, 49, 0.4)"
  }
}

export const lightModeTheme: ThemeProp = {
  ...DefaultTheme,
  roundness: 1
}

export const lightModeYellowTheme: ThemeProp = {
  ...lightModeTheme,
  colors: yellowThemeColors.colors,
}

export const lightModeBlueTheme: ThemeProp = {
  ...lightModeTheme,
  colors: blueThemeColors.colors,
}