import React from "react"
import { Appbar, MD3Theme } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { withTheme } from "react-native-paper"
import { StackHeaderProps } from "@react-navigation/stack"

function CustomStackHeaderBar({
  navigation,
  route,
  options,
  back,
  theme,
}: StackHeaderProps & {theme: MD3Theme}) {
  const title = getHeaderTitle(options, route.name)

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.primaryContainer }}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  )
}

export default withTheme(CustomStackHeaderBar)
