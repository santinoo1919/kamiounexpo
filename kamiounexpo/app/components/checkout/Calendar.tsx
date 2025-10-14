import React, { useState } from "react"
import { View, TouchableOpacity, Modal, ScrollView } from "react-native"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"

interface CalendarProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

export const Calendar = ({ selectedDate, onDateSelect }: CalendarProps) => {
  const { theme } = useAppTheme()
  const [showModal, setShowModal] = useState(false)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getAvailableDates = () => {
    const dates = []
    for (let i = 1; i <= 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const handleDatePress = () => {
    setShowModal(true)
  }

  const handleDateSelect = (date: Date) => {
    onDateSelect(date)
    setShowModal(false)
  }

  return (
    <>
      <Card
        className="mb-lg"
        ContentComponent={
          <View>
            <Text
              text="Delivery Date"
              size="lg"
              weight="bold"
              style={{ color: theme.colors.text }}
              className="mb-xs"
            />
            <Text
              text="Select your preferred delivery date"
              size="sm"
              style={{ color: theme.colors.textDim }}
              className="mb-md"
            />

            {/* Date Selection Button/Display */}
            <TouchableOpacity
              onPress={handleDatePress}
              className={`px-md py-sm rounded-md border ${
                selectedDate
                  ? "bg-primary-100 border-primary-300"
                  : "bg-neutral-200 border-neutral-300"
              }`}
              style={{
                borderColor: selectedDate
                  ? theme.colors.palette.primary300
                  : theme.colors.palette.neutral300,
              }}
            >
              {selectedDate ? (
                <View className="flex-row items-center justify-between">
                  <Text
                    text={formatDate(selectedDate)}
                    size="sm"
                    weight="bold"
                    style={{ color: theme.colors.palette.primary600 }}
                  />
                  <Text text="Tap to change" size="xs" style={{ color: theme.colors.textDim }} />
                </View>
              ) : (
                <View className="flex-row items-center justify-between">
                  <Text
                    text="Select delivery date"
                    size="sm"
                    style={{ color: theme.colors.textDim }}
                  />
                  <Text text="📅" size="sm" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        }
      />

      {/* Date Picker Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View
            className="bg-white rounded-t-lg p-md"
            style={{ backgroundColor: theme.colors.background }}
          >
            <View className="flex-row items-center justify-between mb-md">
              <Text
                text="Select Delivery Date"
                size="lg"
                weight="bold"
                style={{ color: theme.colors.text }}
              />
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text text="✕" size="lg" style={{ color: theme.colors.text }} />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-80">
              {getAvailableDates().map((date, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDateSelect(date)}
                  className={`p-md mb-xs rounded-md ${
                    selectedDate && selectedDate.toDateString() === date.toDateString()
                      ? "bg-primary-600"
                      : "bg-neutral-200"
                  }`}
                >
                  <Text
                    text={formatDate(date)}
                    size="sm"
                    style={{
                      color:
                        selectedDate && selectedDate.toDateString() === date.toDateString()
                          ? "white"
                          : theme.colors.text,
                      fontWeight:
                        selectedDate && selectedDate.toDateString() === date.toDateString()
                          ? "bold"
                          : "normal",
                    }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  )
}
