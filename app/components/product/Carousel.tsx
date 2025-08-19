import React, { useRef, useEffect } from "react"
import { View } from "react-native"
import { FlashList } from "@shopify/flash-list"

interface CarouselProps {
  children: React.ReactNode
  horizontal?: boolean
  showsHorizontalScrollIndicator?: boolean
  showsVerticalScrollIndicator?: boolean
  contentContainerStyle?: any
  className?: string
  activeIndex?: number
  snapToActive?: boolean
}

export const Carousel = ({
  children,
  horizontal = true,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  className = "pl-0 pr-xs py-xs",
  activeIndex = 0,
  snapToActive = false,
}: CarouselProps) => {
  const flashListRef = useRef<FlashList<any>>(null)

  // Convert children to array for FlashList
  const childrenArray = React.Children.toArray(children)

  // Scroll to active item when it changes
  useEffect(() => {
    if (snapToActive && activeIndex > 0 && flashListRef.current) {
      flashListRef.current.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0, // Position active item on the left
      })
    }
  }, [activeIndex, snapToActive])

  const renderItem = ({ item }: { item: React.ReactNode }) => <View className="mr-xs">{item}</View>

  return (
    <View className={className}>
      <FlashList
        ref={flashListRef}
        data={childrenArray}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        estimatedItemSize={120} // Estimated width of each category item
        snapToInterval={120} // Snap to each item
        snapToAlignment="start" // Snap to start (left side)
        decelerationRate="fast"
        contentContainerStyle={{
          alignItems: "flex-start",
          ...contentContainerStyle,
        }}
      />
    </View>
  )
}
