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
      className="w-[250px] h-[120px] rounded-lg overflow-hidden"
      style={{
        backgroundColor: backgroundImage ? undefined : backgroundColor,
      }}
    >
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          className="w-full h-full justify-end"
          resizeMode="cover"
        >
          {/* Gradient overlay for better text readability */}
          <View className="absolute inset-0 bg-black/40" />

          {/* Content - Title at bottom */}
          <View className="px-sm pb-sm z-10">
            <RNText className="text-white text-base font-bold">{title}</RNText>
          </View>
        </ImageBackground>
      ) : (
        // Fallback for when no image is provided
        <View className="flex-1 justify-end px-sm pb-sm">
          <RNText className="text-white text-base font-bold">{title}</RNText>
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
