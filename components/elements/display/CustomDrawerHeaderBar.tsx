import React from "react"
import { Appbar, IconButton, MD3Theme, Text } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { withTheme } from "react-native-paper"
import { DrawerHeaderProps } from "@react-navigation/drawer"
import { View } from "react-native"

function CustomDrawerHeaderBar({
  navigation,
  route,
  options,
  theme,
}: DrawerHeaderProps & { theme: MD3Theme }) {
  const title = getHeaderTitle(options, route.name)
  const {
    headerRight,
    headerLeft,
    headerTintColor,
    headerPressColor,
    headerPressOpacity,
  } = options
  const RightButton = () =>
    headerRight
      ? headerRight({
          tintColor: headerTintColor,
          pressColor: headerPressColor,
          pressOpacity: headerPressOpacity,
        })
      : null

  const LeftButton = () =>
    headerLeft
      ? headerLeft({
          tintColor: headerTintColor,
          pressColor: headerPressColor,
          pressOpacity: headerPressOpacity,
        })
      : null

  return (
    <Appbar.Header
      style={{
        backgroundColor: theme.colors.primaryContainer,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconButton
          icon="menu"
          size={24}
          onPress={() => navigation.openDrawer()}
        />
        <Text style={{ fontSize: 20 }}>{title}</Text>
        <LeftButton />
      </View>
      <RightButton />
    </Appbar.Header>
  )
}

export default withTheme(CustomDrawerHeaderBar)
