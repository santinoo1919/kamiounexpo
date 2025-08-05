import { ComponentType } from "react"
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import { Text, TextProps } from "./Text"

type Presets = "default" | "filled" | "reversed" | "primary" | "secondary"

export interface ButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
  disabled?: boolean
}

interface ExtendedPressableProps extends PressableProps {
  className?: string
}

export interface ButtonProps extends ExtendedPressableProps {
  tx?: TextProps["tx"]
  text?: TextProps["text"]
  txOptions?: TextProps["txOptions"]
  style?: StyleProp<ViewStyle>
  pressedStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  pressedTextStyle?: StyleProp<TextStyle>
  disabledTextStyle?: StyleProp<TextStyle>
  preset?: Presets
  RightAccessory?: ComponentType<ButtonAccessoryProps>
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  children?: React.ReactNode
  disabled?: boolean
  disabledStyle?: StyleProp<ViewStyle>
}

export function Button(props: ButtonProps) {
  const {
    tx,
    text,
    txOptions,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    disabledTextStyle: $disabledTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    disabled,
    disabledStyle: $disabledViewStyleOverride,
    className,
    ...rest
  } = props

  const { theme } = useAppTheme()
  const preset: Presets = props.preset ?? "default"

  // NativeWind classes for layout only
  const layoutClasses = "flex-row items-center justify-center min-h-[56px] rounded px-3 py-3"

  // Theme-based colors and styles
  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
      borderRadius: 4,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
      overflow: "hidden",
    }

    switch (preset) {
      case "default":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.palette.neutral400,
          backgroundColor: theme.colors.palette.neutral200,
        }
      case "filled":
        return { ...baseStyle, backgroundColor: theme.colors.palette.neutral300 }
      case "reversed":
        return { ...baseStyle, backgroundColor: theme.colors.palette.neutral800 }
      case "primary":
        return { ...baseStyle, backgroundColor: theme.colors.palette.primary600 }
      case "secondary":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.palette.neutral400,
          backgroundColor: theme.colors.palette.neutral300,
        }
      default:
        return baseStyle
    }
  }

  // Get text color based on button preset
  const getTextColor = () => {
    switch (preset) {
      case "default":
        return theme.colors.palette.neutral800
      case "filled":
        return theme.colors.palette.neutral800
      case "reversed":
        return theme.colors.palette.neutral100
      case "primary":
        return theme.colors.palette.neutral100
      case "secondary":
        return theme.colors.palette.secondary500
      default:
        return theme.colors.palette.neutral800
    }
  }

  const accessoryStyle: ViewStyle = { marginHorizontal: theme.spacing.xs, zIndex: 1 }

  return (
    <Pressable
      className={layoutClasses}
      style={[getButtonStyles(), $viewStyleOverride, disabled && $disabledViewStyleOverride]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...rest}
      disabled={disabled}
    >
      {(state) => (
        <>
          {!!LeftAccessory && (
            <LeftAccessory
              style={[accessoryStyle, { marginEnd: theme.spacing.xs }]}
              pressableState={state}
              disabled={disabled}
            />
          )}

          <Text
            tx={tx}
            text={text}
            txOptions={txOptions}
            preset="bold"
            style={[
              { color: getTextColor() },
              $textStyleOverride,
              state.pressed && $pressedTextStyleOverride,
              disabled && $disabledTextStyleOverride,
            ]}
          >
            {children}
          </Text>

          {!!RightAccessory && (
            <RightAccessory
              style={[accessoryStyle, { marginStart: theme.spacing.xs }]}
              pressableState={state}
              disabled={disabled}
            />
          )}
        </>
      )}
    </Pressable>
  )
}
