import { ComponentType, forwardRef, Ref, useImperativeHandle, useRef } from "react"
import {
  ImageStyle,
  StyleProp,
  // eslint-disable-next-line no-restricted-imports
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

import { isRTL } from "@/i18n"
import { translate } from "@/i18n/translate"
import { useAppTheme } from "@/theme/context"

import { Text, TextProps } from "./Text"

export interface TextFieldAccessoryProps {
  style: StyleProp<ViewStyle | TextStyle | ImageStyle>
  status: TextFieldProps["status"]
  multiline: boolean
  editable: boolean
}

export interface TextFieldProps extends Omit<TextInputProps, "ref"> {
  status?: "error" | "disabled"
  label?: TextProps["text"]
  labelTx?: TextProps["tx"]
  labelTxOptions?: TextProps["txOptions"]
  LabelTextProps?: TextProps
  helper?: TextProps["text"]
  helperTx?: TextProps["tx"]
  helperTxOptions?: TextProps["txOptions"]
  HelperTextProps?: TextProps
  placeholder?: TextProps["text"]
  placeholderTx?: TextProps["tx"]
  placeholderTxOptions?: TextProps["txOptions"]
  style?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
  inputWrapperStyle?: StyleProp<ViewStyle>
  className?: string
  RightAccessory?: ComponentType<TextFieldAccessoryProps>
  LeftAccessory?: ComponentType<TextFieldAccessoryProps>
}

export const TextField = forwardRef(function TextField(props: TextFieldProps, ref: Ref<TextInput>) {
  const {
    labelTx,
    label,
    labelTxOptions,
    placeholderTx,
    placeholder,
    placeholderTxOptions,
    helper,
    helperTx,
    helperTxOptions,
    status,
    RightAccessory,
    LeftAccessory,
    HelperTextProps,
    LabelTextProps,
    style: $inputStyleOverride,
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
    className,
    ...TextInputProps
  } = props
  const input = useRef<TextInput>(null)
  const { theme } = useAppTheme()

  const disabled = TextInputProps.editable === false || status === "disabled"
  const placeholderContent = placeholderTx
    ? translate(placeholderTx, placeholderTxOptions)
    : placeholder

  // NativeWind classes for layout and static values
  const containerClasses = className || ""
  const inputWrapperClasses = "flex-row items-start border border-xs rounded-md overflow-hidden"
  const inputClasses = "flex-1 self-stretch my-xs mx-sm"

  // Theme-based styles (dynamic for theme switching)
  const getLabelStyles = () => {
    return {
      marginBottom: theme.spacing.xs,
    }
  }

  const getInputWrapperStyles = () => {
    const baseStyle: ViewStyle = {
      alignItems: "flex-start",
      backgroundColor: theme.colors.palette.neutral200,
      borderColor: theme.colors.palette.neutral300,
    }

    if (status === "error") {
      baseStyle.borderColor = theme.colors.error
    }

    if (TextInputProps.multiline) {
      baseStyle.minHeight = 112
    }

    if (LeftAccessory) {
      baseStyle.paddingStart = 0
    }

    if (RightAccessory) {
      baseStyle.paddingEnd = 0
    }

    return baseStyle
  }

  const getInputStyles = () => {
    const baseStyle: TextStyle = {
      fontFamily: theme.typography.primary.normal,
      color: theme.colors.text,
      fontSize: 16,
      height: 24,
      paddingVertical: 0,
      paddingHorizontal: 0,
    }

    if (disabled) {
      baseStyle.color = theme.colors.textDim
    }

    if (isRTL) {
      baseStyle.textAlign = "right"
    }

    if (TextInputProps.multiline) {
      baseStyle.height = "auto"
    }

    return baseStyle
  }

  const getHelperStyles = () => {
    const baseStyle: TextStyle = {
      marginTop: theme.spacing.xs,
    }

    if (status === "error") {
      baseStyle.color = theme.colors.error
    }

    return baseStyle
  }

  const getRightAccessoryStyles = (): ViewStyle => {
    return {
      marginEnd: theme.spacing.xs,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    }
  }

  const getLeftAccessoryStyles = (): ViewStyle => {
    return {
      marginStart: theme.spacing.xs,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    }
  }

  function focusInput() {
    if (disabled) return
    input.current?.focus()
  }

  useImperativeHandle(ref, () => input.current as TextInput)

  return (
    <TouchableOpacity
      activeOpacity={1}
      className={containerClasses}
      style={[$containerStyleOverride]}
      onPress={focusInput}
      accessibilityState={{ disabled }}
    >
      {!!(label || labelTx) && (
        <Text
          preset="formLabel"
          text={label}
          tx={labelTx}
          txOptions={labelTxOptions}
          {...LabelTextProps}
          style={[getLabelStyles(), LabelTextProps?.style]}
        />
      )}

      <View
        className={inputWrapperClasses}
        style={[getInputWrapperStyles(), $inputWrapperStyleOverride]}
      >
        {!!LeftAccessory && (
          <LeftAccessory
            style={getLeftAccessoryStyles()}
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}

        <TextInput
          ref={input}
          className={inputClasses}
          underlineColorAndroid={theme.colors.transparent}
          textAlignVertical="top"
          placeholder={placeholderContent}
          placeholderTextColor={theme.colors.textDim}
          {...TextInputProps}
          editable={!disabled}
          style={[getInputStyles(), $inputStyleOverride]}
        />

        {!!RightAccessory && (
          <RightAccessory
            style={getRightAccessoryStyles()}
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}
      </View>

      {!!(helper || helperTx) && (
        <Text
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={[getHelperStyles(), HelperTextProps?.style]}
        />
      )}
    </TouchableOpacity>
  )
})
