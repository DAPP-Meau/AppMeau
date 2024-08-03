import React from "react"
import { Appbar, IconButton, MD3Theme, Text } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { withTheme } from "react-native-paper"
import { DrawerHeaderProps } from "@react-navigation/drawer"

function CustomDrawerHeaderBar({
  navigation,
  route,
  options,
  theme,
}: DrawerHeaderProps & {theme: MD3Theme}) {
  const title = getHeaderTitle(options, route.name)

  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.primaryContainer }}>
      <IconButton icon="menu" size={24} onPress={() => navigation.openDrawer()}/>
      <Text style={{fontSize:20}}>{title}</Text>
    </Appbar.Header>
  )
}

export default withTheme(CustomDrawerHeaderBar)
