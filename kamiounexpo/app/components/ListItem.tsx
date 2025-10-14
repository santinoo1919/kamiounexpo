import { forwardRef, ReactElement, ComponentType } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"

import { Icon, IconTypes } from "./Icon"
import { Text, TextProps } from "./Text"

export interface ListItemProps extends TouchableOpacityProps {
  height?: number
  topSeparator?: boolean
  bottomSeparator?: boolean
  text?: TextProps["text"]
  tx?: TextProps["tx"]
  children?: TextProps["children"]
  txOptions?: TextProps["txOptions"]
  textStyle?: StyleProp<TextStyle>
  TextProps?: TextProps
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  leftIcon?: IconTypes
  leftIconColor?: string
  rightIcon?: IconTypes
  rightIconColor?: string
  RightComponent?: ReactElement
  LeftComponent?: ReactElement
}

interface ListItemActionProps {
  icon?: IconTypes
  iconColor?: string
  Component?: ReactElement
  size: number
  side: "left" | "right"
}

export const ListItem = forwardRef<View, ListItemProps>(function ListItem(
  props: ListItemProps,
  ref,
) {
  const {
    bottomSeparator,
    children,
    height = 56,
    LeftComponent,
    leftIcon,
    leftIconColor,
    RightComponent,
    rightIcon,
    rightIconColor,
    style,
    text,
    TextProps,
    topSeparator,
    tx,
    txOptions,
    textStyle: $textStyleOverride,
    containerStyle: $containerStyleOverride,
    ...TouchableOpacityProps
  } = props
  const { theme } = useAppTheme()

  const isTouchable =
    TouchableOpacityProps.onPress !== undefined ||
    TouchableOpacityProps.onPressIn !== undefined ||
    TouchableOpacityProps.onPressOut !== undefined ||
    TouchableOpacityProps.onLongPress !== undefined

  // NativeWind classes for layout and static values
  const touchableClasses = "flex-row items-center"
  const textClasses = "flex-grow flex-shrink py-xs text-xs font-bold"

  // Theme-based styles (dynamic for theme switching)
  const getContainerStyles = () => {
    const baseStyle: ViewStyle = {}

    if (topSeparator) {
      baseStyle.borderTopWidth = 0.5
      baseStyle.borderTopColor = theme.colors.palette.neutral300
    }

    if (bottomSeparator) {
      baseStyle.borderBottomWidth = 0.5
      baseStyle.borderBottomColor = theme.colors.palette.neutral300
    }

    return baseStyle
  }

  const getTouchableStyles = () => {
    return {
      minHeight: height,
    }
  }

  const getTextStyles = (): TextStyle => {
    return {
      // Remove inline styles to avoid conflicts with Tailwind
    }
  }

  const Wrapper: ComponentType<TouchableOpacityProps> = isTouchable ? TouchableOpacity : View

  return (
    <View ref={ref} style={[getContainerStyles(), $containerStyleOverride]}>
      <Wrapper
        {...TouchableOpacityProps}
        className={touchableClasses}
        style={[getTouchableStyles(), style]}
      >
        <ListItemAction
          side="left"
          size={height}
          icon={leftIcon}
          iconColor={leftIconColor}
          Component={LeftComponent}
        />

        <Text
          {...TextProps}
          tx={tx}
          text={text}
          txOptions={txOptions}
          className={textClasses}
          style={[getTextStyles(), $textStyleOverride, TextProps?.style]}
        >
          {children}
        </Text>

        <ListItemAction
          side="right"
          size={height}
          icon={rightIcon}
          iconColor={rightIconColor}
          Component={RightComponent}
        />
      </Wrapper>
    </View>
  )
})

function ListItemAction(props: ListItemActionProps) {
  const { icon, Component, iconColor, size, side } = props
  const { theme } = useAppTheme()

  const getIconContainerStyles = () => {
    const baseStyle: ViewStyle = {
      justifyContent: "center",
      alignItems: "center",
      flexGrow: 0,
      height: size,
    }

    if (side === "left") {
      baseStyle.marginEnd = theme.spacing.md
    } else if (side === "right") {
      baseStyle.marginStart = theme.spacing.sm
    }

    return baseStyle
  }

  if (Component) return Component

  if (icon !== undefined) {
    return (
      <View style={getIconContainerStyles()}>
        <View
          style={{
            backgroundColor: theme.colors.palette.primary100,
            borderRadius: 12,
            padding: 6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon size={16} icon={icon} color={theme.colors.palette.primary500} />
        </View>
      </View>
    )
  }

  return null
}
