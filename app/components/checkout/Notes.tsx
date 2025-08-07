import React from "react"
import { View } from "react-native"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAppTheme } from "@/theme/context"

interface NotesProps {
  note: string
  onNoteChange: (note: string) => void
}

export const Notes = ({ note, onNoteChange }: NotesProps) => {
  const { theme } = useAppTheme()

  return (
    <Card
      className="mb-lg"
      ContentComponent={
        <View>
          <Text
            text="Delivery Note (Optional)"
            size="lg"
            weight="bold"
            style={{ color: theme.colors.text }}
            className="mb-xs"
          />
          <Text
            text="Add any special instructions for delivery"
            size="sm"
            style={{ color: theme.colors.textDim }}
            className="mb-md"
          />

          <TextField
            value={note}
            onChangeText={onNoteChange}
            placeholder="Enter delivery instructions..."
            multiline
            numberOfLines={4}
            style={{
              borderColor: theme.colors.palette.neutral300,
              borderWidth: 1,
              borderRadius: 8,
              padding: 12,
              color: theme.colors.text,
              backgroundColor: theme.colors.palette.neutral100,
            }}
          />
        </View>
      }
    />
  )
}
