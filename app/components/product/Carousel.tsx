import React from "react"
import { ScrollView } from "react-native"

import { spacing } from "@/theme/spacing"

interface CarouselProps {
  children: React.ReactNode
  horizontal?: boolean
  showsHorizontalScrollIndicator?: boolean
  showsVerticalScrollIndicator?: boolean
  contentContainerStyle?: any
  className?: string
}

export const Carousel = ({
  children,
  horizontal = true,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  className = "pl-0 pr-md py-xs",
}: CarouselProps) => {
  return (
    <ScrollView
      horizontal={horizontal}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      className={className}
      contentContainerStyle={{
        alignItems: "flex-start",
        ...contentContainerStyle,
      }}
    >
      {children}
    </ScrollView>
  )
}
