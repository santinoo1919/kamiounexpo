/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { ComponentProps } from "react"
import { NavigationContainer, NavigatorScreenParams } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"

import Config from "@/config"
import { useAuth } from "@/context/AuthContext"
import { DeepLinkProvider } from "@/context/DeepLinkContext"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { NewLoginScreen } from "@/screens/NewLoginScreen"
import { WelcomeScreen } from "@/screens/WelcomeScreen"
import { HomeScreen } from "@/screens/HomeScreen"
import { ShopScreen } from "@/screens/ShopScreen"
import { CollectionScreen } from "@/screens/CollectionScreen"
import { CartScreen } from "@/screens/CartScreen"
import { CheckoutScreen } from "@/screens/CheckoutScreen"
import { OrderSuccessScreen } from "@/screens/OrderSuccessScreen"
import { OrdersScreen } from "@/screens/OrdersScreen"
import { useAppTheme } from "@/theme/context"

import { DemoNavigator, DemoTabParamList } from "./DemoNavigator"
import { MainTabNavigator, MainTabParamList } from "./MainTabNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  NewLogin: undefined
  Demo: NavigatorScreenParams<DemoTabParamList>
  Main: NavigatorScreenParams<MainTabParamList>
  Shop: { shop: any }
  Collection: { collection: any }
  Cart: undefined
  Checkout: undefined
  OrderSuccess: { orderId: string }
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const { isAuthenticated } = useAuth()

  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName={isAuthenticated ? "Main" : "NewLogin"}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="Shop" component={ShopScreen} />
          <Stack.Screen name="Collection" component={CollectionScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="NewLogin" component={NewLoginScreen} />
        </>
      )}

      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
}

export interface NavigationProps
  extends Partial<ComponentProps<typeof NavigationContainer<AppStackParamList>>> {}

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <DeepLinkProvider>
          <AppStack />
        </DeepLinkProvider>
      </ErrorBoundary>
    </NavigationContainer>
  )
}
