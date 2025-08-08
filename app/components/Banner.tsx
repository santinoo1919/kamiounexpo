import React from "react"
import { View, TouchableOpacity, Text as RNText } from "react-native"

interface BannerProps {
  title: string
  backgroundColor?: string
  onPress?: () => void
}

export const Banner = ({ title, backgroundColor = "#4A90E2", onPress }: BannerProps) => {
  const BannerContent = () => (
    <View
      style={{
        width: 140,
        height: 90,
        backgroundColor,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* Simple opacity layer - 0% at top, 70% at bottom */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      />

      {/* Content - Title at bottom */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: 8,
          paddingBottom: 8,
        }}
      >
        <RNText
          style={{
            color: "white",
            fontSize: 14,
            fontWeight: "bold",
            textShadowColor: "rgba(0, 0, 0, 0.8)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {title}
        </RNText>
      </View>
    </View>
  )

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <BannerContent />
      </TouchableOpacity>
    )
  }

  return <BannerContent />
}
