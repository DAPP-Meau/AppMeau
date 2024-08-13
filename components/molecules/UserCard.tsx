import { GestureResponderEvent, StyleSheet, Text, View } from "react-native"
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
      <Card.Title title={userData.person.fullName}/>
      <Card.Content>
        <Image
          style={styles.image}
          source={userData.person.pictureURL}
          placeholder={{ blurhash }}
          contentFit="scale-down"
          transition={1000}
        />
          <Text style={styles.userName}>{userData.person.age} anos</Text>
      </Card.Content>
    </Card>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    card: {
      flex: 0.5,
      margin: 10,
    },
    container: {
      margin: 20,
      flexDirection: "column",
      padding: 1,
      gap:10,
      alignItems: "center",
    },
    image: {
      width: "100%",
      height: undefined,
      aspectRatio: 1,
      borderRadius: 5,
    },
    userName: {
      textAlign: "center"
    },
  })
