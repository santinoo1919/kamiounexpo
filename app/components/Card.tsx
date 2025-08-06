import { ComponentType, Fragment, ReactElement } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import { Text, TextProps } from "./Text"

type Presets = "default" | "reversed"

interface CardProps extends TouchableOpacityProps {
  preset?: Presets
  verticalAlignment?: "top" | "center" | "space-between" | "force-footer-bottom"
  LeftComponent?: ReactElement
  RightComponent?: ReactElement
  heading?: TextProps["text"]
  headingTx?: TextProps["tx"]
  headingTxOptions?: TextProps["txOptions"]
  headingStyle?: StyleProp<TextStyle>
  HeadingTextProps?: TextProps
  HeadingComponent?: ReactElement
  content?: TextProps["text"]
  contentTx?: TextProps["tx"]
  contentTxOptions?: TextProps["txOptions"]
  contentStyle?: StyleProp<TextStyle>
  ContentTextProps?: TextProps
  ContentComponent?: ReactElement
  footer?: TextProps["text"]
  footerTx?: TextProps["tx"]
  footerTxOptions?: TextProps["txOptions"]
  footerStyle?: StyleProp<TextStyle>
  FooterTextProps?: TextProps
  FooterComponent?: ReactElement
}

export function Card(props: CardProps) {
  const {
    content,
    contentTx,
    contentTxOptions,
    footer,
    footerTx,
    footerTxOptions,
    heading,
    headingTx,
    headingTxOptions,
    ContentComponent,
    HeadingComponent,
    FooterComponent,
    LeftComponent,
    RightComponent,
    verticalAlignment = "top",
    style: $containerStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    footerStyle: $footerStyleOverride,
    ContentTextProps,
    HeadingTextProps,
    FooterTextProps,
    ...WrapperProps
  } = props

  const { theme } = useAppTheme()

  const preset: Presets = props.preset ?? "default"
  const isPressable = !!WrapperProps.onPress
  const isHeadingPresent = !!(HeadingComponent || heading || headingTx)
  const isContentPresent = !!(ContentComponent || content || contentTx)
  const isFooterPresent = !!(FooterComponent || footer || footerTx)

  const Wrapper = (isPressable ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >
  const HeaderContentWrapper = verticalAlignment === "force-footer-bottom" ? View : Fragment

  // NativeWind classes for layout and static values
  const layoutClasses = "flex-row items-stretch rounded-lg p-xs shadow-card min-h-[96px]"

  // Theme-based styles (dynamic for theme switching)
  const getContainerStyles = () => {
    const baseStyle: ViewStyle = {
      borderWidth: 1,
    }

    switch (preset) {
      case "default":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.palette.neutral100,
          borderColor: theme.colors.palette.neutral300,
        }
      case "reversed":
        return {
          ...baseStyle,
          backgroundColor: theme.colors.palette.neutral800,
          borderColor: theme.colors.palette.neutral500,
        }
      default:
        return baseStyle
    }
  }

  const getHeadingStyles = () => {
    const baseStyle: TextStyle = {}

    if (preset === "reversed") {
      baseStyle.color = theme.colors.palette.neutral100
    }

    if (isFooterPresent || isContentPresent) {
      baseStyle.marginBottom = theme.spacing.xxxs
    }

    return baseStyle
  }

  const getContentStyles = () => {
    const baseStyle: TextStyle = {}

    if (preset === "reversed") {
      baseStyle.color = theme.colors.palette.neutral100
    }

    if (isHeadingPresent) {
      baseStyle.marginTop = theme.spacing.xxxs
    }

    if (isFooterPresent) {
      baseStyle.marginBottom = theme.spacing.xxxs
    }

    return baseStyle
  }

  const getFooterStyles = () => {
    const baseStyle: TextStyle = {}

    if (preset === "reversed") {
      baseStyle.color = theme.colors.palette.neutral100
    }

    if (isHeadingPresent || isContentPresent) {
      baseStyle.marginTop = theme.spacing.xxxs
    }

    return baseStyle
  }

  const getAlignmentWrapperStyles = () => {
    const baseStyle: ViewStyle = {
      flex: 1,
      alignSelf: "stretch",
    }

    const flexOptions: Record<string, "flex-start" | "center" | "space-between"> = {
      "top": "flex-start",
      "center": "center",
      "space-between": "space-between",
      "force-footer-bottom": "space-between",
    }

    baseStyle.justifyContent = flexOptions[verticalAlignment]

    if (LeftComponent) {
      baseStyle.marginStart = theme.spacing.md
    }

    if (RightComponent) {
      baseStyle.marginEnd = theme.spacing.md
    }

    return baseStyle
  }

  return (
    <Wrapper
      className={layoutClasses}
      style={[getContainerStyles(), $containerStyleOverride]}
      activeOpacity={0.8}
      accessibilityRole={isPressable ? "button" : undefined}
      {...WrapperProps}
    >
      {LeftComponent}

      <View style={getAlignmentWrapperStyles()}>
        <HeaderContentWrapper>
          {HeadingComponent ||
            (isHeadingPresent && (
              <Text
                weight="bold"
                text={heading}
                tx={headingTx}
                txOptions={headingTxOptions}
                {...HeadingTextProps}
                style={[getHeadingStyles(), $headingStyleOverride, HeadingTextProps?.style]}
              />
            ))}

          {ContentComponent ||
            (isContentPresent && (
              <Text
                weight="normal"
                text={content}
                tx={contentTx}
                txOptions={contentTxOptions}
                {...ContentTextProps}
                style={[getContentStyles(), $contentStyleOverride, ContentTextProps?.style]}
              />
            ))}
        </HeaderContentWrapper>

        {FooterComponent ||
          (isFooterPresent && (
            <Text
              weight="normal"
              size="xs"
              text={footer}
              tx={footerTx}
              txOptions={footerTxOptions}
              {...FooterTextProps}
              style={[getFooterStyles(), $footerStyleOverride, FooterTextProps?.style]}
            />
          ))}
      </View>

      {RightComponent}
    </Wrapper>
  )
}
