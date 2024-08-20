import React from "react"
import { Appbar, IconButton, MD3Theme } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { withTheme } from "react-native-paper"
import { StackHeaderProps } from "@react-navigation/stack"
import { View } from "react-native"

function CustomStackHeaderBar({
  navigation,
  route,
  options,
  back,
  theme,
}: StackHeaderProps & { theme: MD3Theme }) {
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

  const BackButton = () =>
    back ? <IconButton icon="arrow-left" onPress={navigation.goBack} /> : null

  return (
    <Appbar.Header
      style={{
        backgroundColor: theme.colors.primaryContainer,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <BackButton />
        <Appbar.Content title={title} />
        <LeftButton />
      </View>

      <RightButton />
    </Appbar.Header>
  )
}

export default withTheme(CustomStackHeaderBar)
