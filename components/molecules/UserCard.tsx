import { StyleSheet, Text, View } from "react-native"
import React, { ReactNode } from "react"
import { Image } from "expo-image"
import { blurhash } from "@/constants/blurhash"
import { User } from "@/models"

interface IUserCardProps {
  user: User
  left?: ReactNode
  right?: ReactNode
}

export default function UserCard({ user, left, right }: IUserCardProps) {
  const styles = makeStyles()
  const { person } = user

  return (
    <View style={styles.item}>
      {left ?? null}
      <Image
        style={styles.profileImage}
        source={person.pictureURL}
        placeholder={{ blurhash }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{person.fullName}</Text>
      </View>
      {right ?? null}
    </View>
  )
}

const makeStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontWeight: "bold",
      fontSize: 16,
    },
  })
