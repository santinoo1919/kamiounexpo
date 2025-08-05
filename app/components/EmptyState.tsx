import { Image, ImageProps, ImageStyle, StyleProp, TextStyle, View, ViewStyle } from "react-native"

import { translate } from "@/i18n/translate"
import { useAppTheme } from "@/theme/context"

import { Button, ButtonProps } from "./Button"
import { Text, TextProps } from "./Text"

const sadFace = require("@assets/images/sad-face.png")

interface EmptyStateProps {
  preset?: "generic"
  style?: StyleProp<ViewStyle>
  imageSource?: ImageProps["source"]
  imageStyle?: StyleProp<ImageStyle>
  ImageProps?: Omit<ImageProps, "source">
  heading?: TextProps["text"]
  headingTx?: TextProps["tx"]
  headingTxOptions?: TextProps["txOptions"]
  headingStyle?: StyleProp<TextStyle>
  HeadingTextProps?: TextProps
  content?: TextProps["text"]
  contentTx?: TextProps["tx"]
  contentTxOptions?: TextProps["txOptions"]
  contentStyle?: StyleProp<TextStyle>
  ContentTextProps?: TextProps
  button?: TextProps["text"]
  buttonTx?: TextProps["tx"]
  buttonTxOptions?: TextProps["txOptions"]
  buttonStyle?: ButtonProps["style"]
  buttonTextStyle?: ButtonProps["textStyle"]
  buttonOnPress?: ButtonProps["onPress"]
  ButtonProps?: ButtonProps
}

interface EmptyStatePresetItem {
  imageSource: ImageProps["source"]
  heading: TextProps["text"]
  content: TextProps["text"]
  button: TextProps["text"]
}

export function EmptyState(props: EmptyStateProps) {
  const { theme } = useAppTheme()

  const EmptyStatePresets = {
    generic: {
      imageSource: sadFace,
      heading: translate("emptyStateComponent:generic.heading"),
      content: translate("emptyStateComponent:generic.content"),
      button: translate("emptyStateComponent:generic.button"),
    } as EmptyStatePresetItem,
  } as const

  const preset = EmptyStatePresets[props.preset ?? "generic"]

  const {
    button = preset.button,
    buttonTx,
    buttonOnPress,
    buttonTxOptions,
    content = preset.content,
    contentTx,
    contentTxOptions,
    heading = preset.heading,
    headingTx,
    headingTxOptions,
    imageSource = preset.imageSource,
    style: $containerStyleOverride,
    buttonStyle: $buttonStyleOverride,
    buttonTextStyle: $buttonTextStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    imageStyle: $imageStyleOverride,
    ButtonProps,
    ContentTextProps,
    HeadingTextProps,
    ImageProps,
  } = props

  const isImagePresent = !!imageSource
  const isHeadingPresent = !!(heading || headingTx)
  const isContentPresent = !!(content || contentTx)
  const isButtonPresent = !!(button || buttonTx)

  // NativeWind classes for layout
  const containerClasses = "items-center"
  
  // Theme-based styles
  const getImageStyles = () => {
    const baseStyle: ImageStyle = {
      alignSelf: "center",
    }

    if (isHeadingPresent || isContentPresent || isButtonPresent) {
      baseStyle.marginBottom = theme.spacing.xxxs
    }

    return baseStyle
  }

  const getHeadingStyles = () => {
    const baseStyle: TextStyle = {
      textAlign: "center",
      paddingHorizontal: theme.spacing.lg,
    }

    if (isImagePresent) {
      baseStyle.marginTop = theme.spacing.xxxs
    }

    if (isContentPresent || isButtonPresent) {
      baseStyle.marginBottom = theme.spacing.xxxs
    }

    return baseStyle
  }

  const getContentStyles = () => {
    const baseStyle: TextStyle = {
      textAlign: "center",
      paddingHorizontal: theme.spacing.lg,
    }

    if (isImagePresent || isHeadingPresent) {
      baseStyle.marginTop = theme.spacing.xxxs
    }

    if (isButtonPresent) {
      baseStyle.marginBottom = theme.spacing.xxxs
    }

    return baseStyle
  }

  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {}

    if (isImagePresent || isHeadingPresent || isContentPresent) {
      baseStyle.marginTop = theme.spacing.xl
    }

    return baseStyle
  }

  return (
    <View className={containerClasses} style={[$containerStyleOverride]}>
      {isImagePresent && (
        <Image
          source={imageSource}
          {...ImageProps}
          style={[getImageStyles(), $imageStyleOverride, ImageProps?.style]}
          tintColor={theme.colors.palette.neutral900}
        />
      )}

      {isHeadingPresent && (
        <Text
          preset="subheading"
          text={heading}
          tx={headingTx}
          txOptions={headingTxOptions}
          {...HeadingTextProps}
          style={[getHeadingStyles(), $headingStyleOverride, HeadingTextProps?.style]}
        />
      )}

      {isContentPresent && (
        <Text
          text={content}
          tx={contentTx}
          txOptions={contentTxOptions}
          {...ContentTextProps}
          style={[getContentStyles(), $contentStyleOverride, ContentTextProps?.style]}
        />
      )}

      {isButtonPresent && (
        <Button
          onPress={buttonOnPress}
          text={button}
          tx={buttonTx}
          txOptions={buttonTxOptions}
          textStyle={$buttonTextStyleOverride}
          {...ButtonProps}
          style={[getButtonStyles(), $buttonStyleOverride, ButtonProps?.style]}
        />
      )}
    </View>
  )
}
