import { GestureResponderEvent, StyleSheet, Text } from "react-native"
import React from "react"
import { Card, MD3Theme, useTheme } from "react-native-paper"
import { Image } from "expo-image"
import { GetUserActionReturn } from "@/services/api/user/getUserAction"
import { blurhash } from "@/constants/blurhash"

interface IUserCardProps {
  user: GetUserActionReturn
  onPress: (e: GestureResponderEvent) => void
}

export default function UserCard({ user, onPress }: IUserCardProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const { data: userData } = user

  return (
    <Card style={styles.card} onPress={onPress}>
      <Image
        style={styles.image}
        source={userData.person.pictureURL}
        placeholder={{ blurhash }}
        contentFit="scale-down"
        transition={1000}
      />
      <Text style={styles.userName}>{userData.person.fullName}</Text>
      <Text style={styles.userName}>{userData.person.age} anos</Text>
    </Card>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: {
      margin: 20,
      backgroundColor: theme.colors.surface,
      flexDirection: "row",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      flex: 0.5,
      padding: 10,
    },
    image: {
      height: 140,
      width: 140,
    },
    userName: {
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      margin: 10,
    },
  })
