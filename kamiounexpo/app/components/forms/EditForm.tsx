import React from "react"
import { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useAppTheme } from "@/theme/context"

interface EditFormProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  multiline?: boolean
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
}

export const EditForm = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = "default",
}: EditFormProps) => {
  const { theme } = useAppTheme()

  return (
    <BottomSheetTextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      multiline={multiline}
      keyboardType={keyboardType}
      className="border rounded-md p-md mb-md"
      style={{
        borderColor: theme.colors.palette.neutral300,
        color: theme.colors.text,
        backgroundColor: theme.colors.background,
        minHeight: multiline ? 80 : 48,
      }}
    />
  )
}
