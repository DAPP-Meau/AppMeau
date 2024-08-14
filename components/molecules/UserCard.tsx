import { StyleSheet, Text, View } from "react-native"
import React, { ReactNode } from "react"
import { MD3Theme, useTheme } from "react-native-paper"
import { Image } from "expo-image"
import { GetUserActionReturn } from "@/services/api/user/getUserAction"
import { blurhash } from "@/constants/blurhash"

interface IUserCardProps {
  user: GetUserActionReturn
  left?: ReactNode
  right?: ReactNode
}

export default function UserCard({ user, left, right }: IUserCardProps) {
  const theme = useTheme()
  const styles = makeStyles(theme)
  const { data: userData } = user

  return (
    <View style={styles.item}>
      {left ?? null}
      <Image
        style={styles.profileImage}
        source={userData.person.pictureURL}
        placeholder={{ blurhash }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{userData.person.fullName}</Text>
      </View>
      {right ?? null}
    </View>
  )
}

const makeStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.backdrop,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontWeight: "bold",
      fontSize: 16,
    },
  })
