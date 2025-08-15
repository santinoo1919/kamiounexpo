import { ReactElement } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"

import { isRTL } from "@/i18n"
import { translate } from "@/i18n/translate"
import { useAppTheme } from "@/theme/context"
import { ExtendedEdge, useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

import { IconTypes, PressableIcon } from "./Icon"
import { Text, TextProps } from "./Text"

export interface HeaderProps {
  titleMode?: "center" | "flex"
  titleStyle?: StyleProp<TextStyle>
  titleContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  backgroundColor?: string
  title?: TextProps["text"]
  titleTx?: TextProps["tx"]
  titleTxOptions?: TextProps["txOptions"]
  leftIcon?: IconTypes
  leftIconColor?: string
  leftText?: TextProps["text"]
  leftTx?: TextProps["tx"]
  LeftActionComponent?: ReactElement
  leftTxOptions?: TextProps["txOptions"]
  onLeftPress?: TouchableOpacityProps["onPress"]
  rightIcon?: IconTypes
  rightIconColor?: string
  rightText?: TextProps["text"]
  rightTx?: TextProps["tx"]
  RightActionComponent?: ReactElement
  rightTxOptions?: TextProps["txOptions"]
  onRightPress?: TouchableOpacityProps["onPress"]
  safeAreaEdges?: ExtendedEdge[]
  extendedContent?: ReactElement
}

interface HeaderActionProps {
  backgroundColor?: string
  icon?: IconTypes
  iconColor?: string
  text?: TextProps["text"]
  tx?: TextProps["tx"]
  txOptions?: TextProps["txOptions"]
  onPress?: TouchableOpacityProps["onPress"]
  ActionComponent?: ReactElement
}

export function Header(props: HeaderProps) {
  const { theme } = useAppTheme()
  const {
    backgroundColor = theme.colors.background,
    LeftActionComponent,
    leftIcon,
    leftIconColor,
    leftText,
    leftTx,
    leftTxOptions,
    onLeftPress,
    onRightPress,
    RightActionComponent,
    rightIcon,
    rightIconColor,
    rightText,
    rightTx,
    rightTxOptions,
    safeAreaEdges = ["top"],
    title,
    titleMode = "center",
    titleTx,
    titleTxOptions,
    titleContainerStyle: $titleContainerStyleOverride,
    style: $styleOverride,
    titleStyle: $titleStyleOverride,
    containerStyle: $containerStyleOverride,
    extendedContent,
  } = props

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges)
  const titleContent = titleTx ? translate(titleTx, titleTxOptions) : title

  // NativeWind classes for layout and static values
  const containerClasses = "w-full"
  const wrapperClasses = "flex-row items-center justify-between h-14"

  // Theme-based styles (dynamic for theme switching)
  const getContainerStyles = () => {
    return {
      backgroundColor,
    }
  }

  const getTitleWrapperStyles = () => {
    const baseStyle: ViewStyle = {
      pointerEvents: "none",
    }

    if (titleMode === "center") {
      baseStyle.alignItems = "center"
      baseStyle.justifyContent = "center"
      baseStyle.height = "100%"
      baseStyle.width = "100%"
      baseStyle.position = "absolute"
      baseStyle.zIndex = 1
    } else if (titleMode === "flex") {
      baseStyle.justifyContent = "center"
      baseStyle.flexGrow = 1
    }

    return baseStyle
  }

  const getTitleStyles = () => {
    return {
      textAlign: "center" as const,
    }
  }

  return (
    <View
      className={containerClasses}
      style={[$containerInsets, getContainerStyles(), $containerStyleOverride]}
    >
      <View className={wrapperClasses} style={[$styleOverride]}>
        <HeaderAction
          tx={leftTx}
          text={leftText}
          icon={leftIcon}
          iconColor={leftIconColor}
          onPress={onLeftPress}
          txOptions={leftTxOptions}
          backgroundColor={backgroundColor}
          ActionComponent={LeftActionComponent}
        />

        {!!titleContent && (
          <View
            className={titleMode === "center" ? "px-xxl" : ""}
            style={[getTitleWrapperStyles(), $titleContainerStyleOverride]}
          >
            <Text
              weight="medium"
              size="md"
              text={titleContent}
              style={[getTitleStyles(), $titleStyleOverride]}
            />
          </View>
        )}

        <HeaderAction
          tx={rightTx}
          text={rightText}
          icon={rightIcon}
          iconColor={rightIconColor}
          onPress={onRightPress}
          txOptions={rightTxOptions}
          backgroundColor={backgroundColor}
          ActionComponent={RightActionComponent}
        />
      </View>

      {/* Extended Content */}
      {extendedContent && <View style={{ backgroundColor }}>{extendedContent}</View>}
    </View>
  )
}

function HeaderAction(props: HeaderActionProps) {
  const { backgroundColor, icon, text, tx, txOptions, onPress, ActionComponent, iconColor } = props
  const { theme } = useAppTheme()

  const content = tx ? translate(tx, txOptions) : text

  if (ActionComponent) return ActionComponent

  if (content) {
    return (
      <TouchableOpacity
        style={getActionTextContainerStyles(backgroundColor)}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.8}
      >
        <Text weight="medium" size="md" text={content} style={getActionTextStyles()} />
      </TouchableOpacity>
    )
  }

  if (icon) {
    return (
      <PressableIcon
        size={24}
        icon={icon}
        color={iconColor}
        onPress={onPress}
        containerStyle={getActionIconContainerStyles(backgroundColor)}
        style={isRTL ? { transform: [{ rotate: "180deg" }] } : {}}
      />
    )
  }

  return <View style={getActionFillerStyles(backgroundColor)} />
}

const getActionTextContainerStyles = (backgroundColor?: string): ViewStyle => {
  return {
    flexGrow: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingHorizontal: 16, // md spacing
    zIndex: 2,
    backgroundColor,
  }
}

const getActionTextStyles = () => {
  return {
    color: "#1F4898", // primary color
  }
}

const getActionIconContainerStyles = (backgroundColor?: string): ViewStyle => {
  return {
    flexGrow: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingHorizontal: 16, // md spacing
    zIndex: 2,
    backgroundColor,
  }
}

const getActionFillerStyles = (backgroundColor?: string) => {
  return {
    width: 16,
    backgroundColor,
  }
}
