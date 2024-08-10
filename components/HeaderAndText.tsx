import React, { ReactNode } from "react"
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native"
import { MD3Theme, useTheme } from "react-native-paper"

interface IHeaderAndTextProps {
  title: string
  children: ReactNode
  style?: StyleProp<ViewStyle>
}

export default function HeaderAndText({
  title: Header,
  children,
  style,
}: IHeaderAndTextProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  return (
    <View style={[{ gap: 2, flex: 1 }, style]}>
      <Text style={styles.sectionTitle}>{Header}</Text>
      {children}
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    sectionTitle: {
      textTransform: "uppercase",
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: "bold",
    },
  })
