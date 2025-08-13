import React from "react"
import { View, TouchableOpacity, Text as RNText, ImageBackground } from "react-native"

interface BannerProps {
  title: string
  backgroundImage?: any
  backgroundColor?: string
  onPress?: () => void
}

export const Banner = ({
  title,
  backgroundImage,
  backgroundColor = "#4A90E2",
  onPress,
}: BannerProps) => {
  const BannerContent = () => (
    <View
      style={{
        width: 200,
        height: 120,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: backgroundImage ? undefined : backgroundColor,
      }}
    >
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "flex-end",
          }}
          resizeMode="cover"
        >
          {/* Gradient overlay for better text readability */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
          />

          {/* Content - Title at bottom */}
          <View
            style={{
              paddingHorizontal: 12,
              paddingBottom: 12,
              zIndex: 1,
            }}
          >
            <RNText
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                textShadowColor: "rgba(0, 0, 0, 0.8)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
              }}
            >
              {title}
            </RNText>
          </View>
        </ImageBackground>
      ) : (
        // Fallback for when no image is provided
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingHorizontal: 12,
            paddingBottom: 12,
          }}
        >
          <RNText
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              textShadowColor: "rgba(0, 0, 0, 0.8)",
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            }}
          >
            {title}
          </RNText>
        </View>
      )}
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
