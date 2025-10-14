import { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import { AutoImage } from "@/components/AutoImage"
import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { isRTL } from "@/i18n"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

const welcomeLogo = require("@assets/images/logo.png")
const welcomeFace = require("@assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen(_props) {
  const { themed, theme } = useAppTheme()

  const { navigation } = _props
  const { logout } = useAuth()

  function goNext() {
    navigation.navigate("Main", { screen: "Home" })
  }

  useHeader(
    {
      rightTx: "common:logOut",
      onRightPress: logout,
    },
    [logout],
  )

  return (
    <Screen preset="fixed" className="flex-1">
      <View className="flex-shrink flex-grow flex-basis-57 justify-center px-lg py-lg pt-xl">
        <AutoImage className="h-22 w-full mb-xxl" source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          tx="welcomeScreen:readyForLaunch"
          preset="subheading2"
          className="mb-md"
        />
        <Text tx="welcomeScreen:exciting" preset="subheading2" />
        <AutoImage
          className="h-42 w-67 absolute bottom-neg-12 right-neg-20"
          source={welcomeFace}
          resizeMode="contain"
          tintColor={theme.colors.palette.neutral600}
          style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
        />
      </View>

      <View className="flex-shrink flex-grow-0 bg-neutral100 rounded-t-2xl px-lg py-lg">
        <Text tx="welcomeScreen:postscript" size="md" className="text-center mb-sm" />

        <Button
          testID="next-screen-button"
          preset="secondary"
          tx="welcomeScreen:letsGo"
          onPress={goNext}
        />
      </View>
    </Screen>
  )
}
