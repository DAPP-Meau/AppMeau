import React from "react"
import { Text, View } from "react-native"
import { Icon, ProgressBar } from "react-native-paper"

interface IListEmptyProps {
  loading: boolean
  message: string
  hideEmptyMessage?: boolean
}

export default function ListEmpty({
  loading,
  message,
  hideEmptyMessage,
}: IListEmptyProps) {
  const hide = hideEmptyMessage ?? false

  return (
    <View>
      {loading ? (
        <ProgressBar indeterminate />
      ) : (
        !hide && (
          <View style={{ margin: 20, alignItems: "center" }}>
            <Icon source="alert-circle-outline" size={40} />
            <Text>{message}</Text>
          </View>
        )
      )}
    </View>
  )
}
