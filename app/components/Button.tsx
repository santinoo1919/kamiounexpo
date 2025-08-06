import { ComponentType, forwardRef, ForwardedRef } from "react"
import { Pressable, PressableProps, ViewStyle, StyleProp } from "react-native"

import { translate } from "@/i18n/translate"
import { useAppTheme } from "@/theme/context"

import { Text, TextProps } from "./Text"

interface ExtendedPressableProps extends PressableProps {
  className?: string
}

export interface ButtonProps extends ExtendedPressableProps {
  tx?: TextProps["tx"]
  txOptions?: TextProps["txOptions"]
  text?: TextProps["text"]
  textStyle?: TextProps["style"]
  style?: StyleProp<ViewStyle>
  LeftAccessory?: ComponentType<any>
  RightAccessory?: ComponentType<any>
  children?: React.ReactNode
  disabled?: boolean
  preset?: "default" | "primary" | "secondary"
}

export function Button(props: ButtonProps) {
  const { className, ...rest } = props
  const {
    tx,
    txOptions,
    text,
    textStyle: $textStyleOverride,
    LeftAccessory,
    RightAccessory,
    children,
    disabled,
    preset = "default",
    ...PressableProps
  } = rest
  const { theme } = useAppTheme()

  // NativeWind classes for static layout and spacing
  const layoutClasses =
    "flex-row items-center justify-center min-h-button rounded-lg px-md py-sm w-full"

  // Theme-based colors (dynamic for theme switching)
  const getButtonColors = () => {
    const colors = {
      default: {
        backgroundColor: theme.colors.palette.neutral300,
        borderColor: theme.colors.palette.neutral400,
        textColor: theme.colors.palette.neutral800,
      },
      primary: {
        backgroundColor: theme.colors.palette.accent100,
        borderColor: theme.colors.palette.accent100,
        textColor: theme.colors.palette.primary600,
      },
      secondary: {
        backgroundColor: theme.colors.palette.primary600,
        borderColor: theme.colors.palette.primary600,
        textColor: theme.colors.palette.neutral100,
      },
    }
    return colors[preset] || colors.default
  }

  // Dynamic state classes
  const getStateClasses = () => {
    let classes = ""

    if (disabled) {
      classes += " opacity-50"
    }

    // Add shadow for primary preset
    if (preset === "primary") {
      classes += " shadow-button"
    }

    return classes
  }

  // Pressed state classes
  const getPressedClasses = (isPressed: boolean) => {
    return isPressed ? " opacity-80" : ""
  }

  const buttonClasses = `${layoutClasses}${getStateClasses()}${className ? ` ${className}` : ""}`

  const accessoryStyle: ViewStyle = { marginHorizontal: theme.spacing.xs, zIndex: 1 }

  return (
    <Pressable
      className={buttonClasses}
      style={[
        {
          backgroundColor: getButtonColors().backgroundColor,
          borderColor: getButtonColors().borderColor,
          borderWidth: preset === "secondary" ? 1 : 0,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...PressableProps}
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
            preset="default"
            className={getPressedClasses(state.pressed)}
            style={[{ color: getButtonColors().textColor }, $textStyleOverride]}
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
