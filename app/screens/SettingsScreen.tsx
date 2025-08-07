import React from "react"
import { View } from "react-native"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"

const SettingsScreenComponent = () => {
  const { theme } = useAppTheme()

  return (
    <View className="flex-1">
      {/* Header */}
      <Header title="Settings" />

      {/* Content */}
      <Screen preset="scroll" className="flex-1">
        <View className="px-md py-lg">
          <Card
            className="mb-lg"
            ContentComponent={
              <View className="p-md">
                <Text
                  text="Settings"
                  size="lg"
                  weight="bold"
                  style={{ color: theme.colors.text }}
                  className="mb-xs"
                />
                <Text
                  text="Settings screen coming soon..."
                  size="sm"
                  style={{ color: theme.colors.textDim }}
                />
              </View>
            }
          />
        </View>
      </Screen>
    </View>
  )
}

export const SettingsScreen = SettingsScreenComponent
