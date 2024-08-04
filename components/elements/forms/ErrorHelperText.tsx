import { FieldError } from "react-hook-form"
import { HelperText } from "react-native-paper"
import React from "react"

export default function ErrorHelperText({
  show,
  message,
}: {
  show?: FieldError | string | undefined
  message?: string
}) {
  return (
    (show ? true : false) && <HelperText type="error">{message}</HelperText>
  )
}
