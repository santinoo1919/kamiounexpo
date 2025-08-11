import React, { useCallback, useRef, forwardRef, useImperativeHandle } from "react"
import { View, Keyboard } from "react-native"
import GorhomBottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"
import { useAppTheme } from "@/theme/context"

interface BottomSheetProps {
  isVisible?: boolean // Keep for backward compatibility
  onClose?: () => void // Keep for backward compatibility
  title: string
  children: React.ReactNode
  snapPoints?: string[]
  onSave?: () => void
  saveText?: string
  cancelText?: string
  showButtons?: boolean
}

export interface BottomSheetRef {
  show: (config: Omit<BottomSheetProps, "children" | "isVisible" | "onClose">) => void
  hide: () => void
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      isVisible: propIsVisible,
      onClose: propOnClose,
      title,
      children,
      snapPoints = ["40%"],
      onSave,
      saveText = "Save",
      cancelText = "Cancel",
      showButtons = true,
    },
    ref,
  ) => {
    const { theme } = useAppTheme()
    const bottomSheetRef = useRef<GorhomBottomSheet>(null)

    // Simple imperative config storage - no state updates
    const imperativeConfigRef = useRef<Omit<
      BottomSheetProps,
      "children" | "isVisible" | "onClose"
    > | null>(null)

    useImperativeHandle(ref, () => ({
      show: (config) => {
        imperativeConfigRef.current = config
        bottomSheetRef.current?.expand()
      },
      hide: () => {
        Keyboard.dismiss()
        bottomSheetRef.current?.close()
      },
    }))

    // Use imperative config if available, otherwise use props
    const currentTitle = imperativeConfigRef.current?.title ?? title
    const currentOnSave = imperativeConfigRef.current?.onSave ?? onSave
    const currentSaveText = imperativeConfigRef.current?.saveText ?? saveText
    const currentCancelText = imperativeConfigRef.current?.cancelText ?? cancelText
    const currentShowButtons = imperativeConfigRef.current?.showButtons ?? showButtons

    // Update sheet visibility (backward compatibility)
    React.useEffect(() => {
      if (!ref && propIsVisible !== undefined) {
        if (propIsVisible) {
          bottomSheetRef.current?.expand()
        } else {
          bottomSheetRef.current?.close()
        }
      }
    }, [propIsVisible, ref])

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          // Only auto-close if using backward compatibility mode
          if (!ref && propOnClose) {
            Keyboard.dismiss()
            propOnClose()
          }
        }
      },
      [propOnClose, ref],
    )

    const handleSave = useCallback(() => {
      currentOnSave?.()
      Keyboard.dismiss()
      bottomSheetRef.current?.close()
    }, [currentOnSave])

    const handleCancel = useCallback(() => {
      Keyboard.dismiss()
      bottomSheetRef.current?.close()
      // Only call prop onClose if using backward compatibility mode
      if (!ref && propOnClose) {
        propOnClose()
      }
    }, [propOnClose, ref])

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
              text={currentTitle}
              size="lg"
              weight="bold"
              style={{ color: theme.colors.text }}
              className="mb-md"
            />

            {children}
          </View>

          {currentShowButtons && (
            <View className="flex-row space-x-2 mt-lg">
              <Button
                preset="secondary"
                text={currentCancelText}
                onPress={handleCancel}
                className="flex-1"
              />
              <Button
                preset="primary"
                text={currentSaveText}
                onPress={handleSave}
                className="flex-1 ml-md"
              />
            </View>
          )}
        </BottomSheetView>
      </GorhomBottomSheet>
    )
  },
)

BottomSheet.displayName = "BottomSheet"
