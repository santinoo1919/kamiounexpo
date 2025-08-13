import { ReactNode, forwardRef, ForwardedRef } from "react"
// eslint-disable-next-line no-restricted-imports
import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle } from "react-native"
import { TOptions } from "i18next"

import { isRTL, TxKeyPath } from "@/i18n"
import { translate } from "@/i18n/translate"
import { useAppTheme } from "@/theme/context"
import { typography } from "@/theme/typography"

// Extend TextProps to include className for NativeWind
interface ExtendedTextProps extends RNTextProps {
  className?: string
}

type Sizes = keyof typeof $sizeStyles
type Weights = keyof typeof typography.primary
type Presets =
  | "default"
  | "bold"
  | "heading"
  | "subheading"
  | "subheading2"
  | "formLabel"
  | "formHelper"

export interface TextProps extends ExtendedTextProps {
  tx?: TxKeyPath
  text?: string
  txOptions?: TOptions
  style?: StyleProp<TextStyle>
  preset?: Presets
  weight?: Weights
  size?: Sizes
  children?: ReactNode
}

export const Text = forwardRef(function Text(props: TextProps, ref: ForwardedRef<RNText>) {
  const {
    weight,
    size,
    tx,
    txOptions,
    text,
    children,
    style: $styleOverride,
    className,
    ...rest
  } = props
  const { theme } = useAppTheme()

  const i18nText = tx && translate(tx, txOptions)
  const content = i18nText || text || children

  const preset: Presets = props.preset ?? "default"

  // NativeWind classes for layout
  const layoutClasses = "text-center"

  // Theme-based styles
  const getTextStyles = () => {
    const baseStyle: TextStyle = {
      fontSize: 14,
      lineHeight: 21,
      fontFamily: theme.typography.primary.normal,
      color: theme.colors.text,
    }

    // Apply size
    if (size) {
      Object.assign(baseStyle, $sizeStyles[size])
    }

    // Apply weight
    if (weight) {
      baseStyle.fontFamily = theme.typography.primary[weight]
    }

    // Apply preset
    switch (preset) {
      case "bold":
        baseStyle.fontFamily = theme.typography.primary.bold
        break
      case "heading":
        baseStyle.fontSize = 36
        baseStyle.lineHeight = 44
        baseStyle.fontFamily = theme.typography.primary.bold
        break
      case "subheading":
        baseStyle.fontSize = 20
        baseStyle.lineHeight = 32
        baseStyle.fontFamily = theme.typography.primary.medium
        break
      case "subheading2":
        baseStyle.fontSize = 16
        baseStyle.lineHeight = 24
        baseStyle.fontFamily = theme.typography.primary.semiBold
        break
      case "formLabel":
        baseStyle.fontFamily = theme.typography.primary.medium
        break
      case "formHelper":
        baseStyle.fontSize = 16
        baseStyle.lineHeight = 24
        baseStyle.fontFamily = theme.typography.primary.normal
        break
      default:
        break
    }

    // Apply RTL
    if (isRTL) {
      baseStyle.writingDirection = "rtl"
    }

    return baseStyle
  }

  return (
    <RNText {...rest} style={[getTextStyles(), $styleOverride]} className={className} ref={ref}>
      {content}
    </RNText>
  )
})

const $sizeStyles = {
  xxl: { fontSize: 36, lineHeight: 44 } satisfies TextStyle,
  xl: { fontSize: 24, lineHeight: 34 } satisfies TextStyle,
  lg: { fontSize: 20, lineHeight: 32 } satisfies TextStyle,
  md: { fontSize: 18, lineHeight: 26 } satisfies TextStyle,
  sm: { fontSize: 16, lineHeight: 24 } satisfies TextStyle,
  xs: { fontSize: 14, lineHeight: 21 } satisfies TextStyle,
  xxs: { fontSize: 12, lineHeight: 18 } satisfies TextStyle,
}
