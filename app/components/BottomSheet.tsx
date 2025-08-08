import React, { useCallback, useMemo, useRef } from "react"
import { View } from "react-native"
import GorhomBottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"

interface BottomSheetProps {
  isVisible: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  snapPoints?: string[]
  onSave?: () => void
  saveText?: string
  cancelText?: string
  showButtons?: boolean
}

export const BottomSheet = ({
  isVisible,
  onClose,
  title,
  children,
  snapPoints = ["40%"],
  onSave,
  saveText = "Save",
  cancelText = "Cancel",
  showButtons = true,
}: BottomSheetProps) => {
  const { theme } = useAppTheme()
  const bottomSheetRef = useRef<GorhomBottomSheet>(null)

  // Update sheet visibility
  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand()
    } else {
      bottomSheetRef.current?.close()
    }
  }, [isVisible])

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose()
      }
    },
    [onClose],
  )

  const handleSave = useCallback(() => {
    onSave?.()
    onClose()
  }, [onSave, onClose])

  const handleCancel = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <GorhomBottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      enableOverDrag={false}
      animateOnMount={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      enableBlurKeyboardOnGesture
      backgroundStyle={{
        backgroundColor: theme.colors.background,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.palette.neutral300,
      }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
      )}
    >
      <BottomSheetView className="flex-1 px-lg py-md">
        <View className="flex-1">
          <Text
            text={title}
            size="lg"
            weight="bold"
            style={{ color: theme.colors.text }}
            className="mb-md"
          />

          {children}
        </View>

        {showButtons && (
          <View className="flex-row space-x-2 mt-lg">
            <Button
              preset="secondary"
              text={cancelText}
              onPress={handleCancel}
              className="flex-1"
            />
            <Button
              preset="primary"
              text={saveText}
              onPress={handleSave}
              className="flex-1 ml-md"
            />
          </View>
        )}
      </BottomSheetView>
    </GorhomBottomSheet>
  )
}
