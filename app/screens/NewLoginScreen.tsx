import React, { useState } from "react"
import { View, TouchableWithoutFeedback, Keyboard } from "react-native"

import { Button } from "@/components/Button"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { useAppTheme } from "@/theme/context"

// Mock data for now
const mockCredentials = {
  number: "12345678",
  password: "password123",
}

export const NewLoginScreen = () => {
  const { theme } = useAppTheme()
  const { setAuthToken } = useAuth()
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [forgotPhoneNumber, setForgotPhoneNumber] = useState("")

  const handleLogin = () => {
    console.log("Login:", { phoneNumber, password, rememberMe })
    // Mock login logic - set auth token to navigate to welcome screen
    setAuthToken(String(Date.now()))
  }

  const handleForgotPassword = () => {
    console.log("Reset password for:", forgotPhoneNumber)
    setShowForgotPassword(false)
  }

  const handleSignUp = () => {
    console.log("Navigate to signup")
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Screen preset="auto" className="flex-1" safeAreaEdges={["top", "bottom"]}>
        <View className="flex-1 px-lg justify-center">
          {/* Form Section */}
          <View className="mb-xxl">
            <Text preset="heading" text="Welcome Back" className=" text-center" />
            <Text
              preset="default"
              text="Sign in to your account"
              className="mb-lg text-center"
              style={{ color: theme.colors.textDim }}
            />

            {/* Phone Number Input */}
            <TextField
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              className="mb-md"
              label="Phone Number"
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password Input */}
            <TextField
              value={password}
              onChangeText={setPassword}
              className="mb-md"
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Remember Me Checkbox */}
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Checkbox
                label="Remember me"
                value={rememberMe}
                onValueChange={setRememberMe}
                labelPosition="right"
              />
            </View>

            {/* Login Button */}
            <View className="mb-lg">
              <Button preset="secondary" text="Log In" onPress={handleLogin} />
            </View>

            {/* Forgot Password Button */}
            <View className="items-center mb-xxl">
              <Button
                preset="default"
                text="Forgot Password?"
                onPress={() => setShowForgotPassword(true)}
              />
            </View>
          </View>

          {/* Footer Section */}
          <View className="items-center">
            <Text text="Don't have an account?" className="mb-lg" />
            <Button preset="primary" text="Sign Up" onPress={handleSignUp} />
          </View>
        </View>

        {/* Forgot Password Modal - Using Screen overlay for now */}
        {showForgotPassword && (
          <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center px-lg">
            <View className="bg-white rounded-lg p-lg w-full max-w-sm">
              <Text preset="subheading" text="Reset Password" className="mb-lg text-center" />

              <TextField
                value={forgotPhoneNumber}
                onChangeText={setForgotPhoneNumber}
                className="mb-md"
                label="Phone Number"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Button
                preset="secondary"
                text="Send Reset Link"
                onPress={handleForgotPassword}
                className="mb-md"
              />

              <Button preset="default" text="Cancel" onPress={() => setShowForgotPassword(false)} />
            </View>
          </View>
        )}
      </Screen>
    </TouchableWithoutFeedback>
  )
}
