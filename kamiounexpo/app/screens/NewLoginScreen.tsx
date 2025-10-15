import React, { useState } from "react"
import { View, TouchableWithoutFeedback, Keyboard } from "react-native"

import { Button } from "@/components/Button"
import { Checkbox } from "@/components/Toggle/Checkbox"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import { useAuth as useAuthStore } from "@/stores/authStore"
import { useAppTheme } from "@/theme/context"

// Mock data for now
const mockCredentials = {
  number: "12345678",
  password: "password123",
}

export const NewLoginScreen = () => {
  const { theme } = useAppTheme()
  const { setAuthToken } = useAuth()
  const { login, register, isLoading, isAuthenticated, customer } = useAuthStore()
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [forgotPhoneNumber, setForgotPhoneNumber] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    try {
      setError("")
      console.log("Login:", { email, password, rememberMe })

      // Use real auth store
      await login({ email, password })

      // Also set the old auth token for navigation compatibility
      setAuthToken(String(Date.now()))

      console.log("Login successful! Customer:", customer)
    } catch (err: any) {
      console.error("Login failed:", err)
      setError(err.message || "Login failed")
    }
  }

  const handleForgotPassword = () => {
    console.log("Reset password for:", forgotPhoneNumber)
    setShowForgotPassword(false)
  }

  const handleSignUp = async () => {
    try {
      setError("")
      console.log("Register:", { email, password })

      // Use real auth store for registration
      await register({
        email,
        password,
        first_name: "Test",
        last_name: "User",
      })

      // Also set the old auth token for navigation compatibility
      setAuthToken(String(Date.now()))

      console.log("Registration successful! Customer:", customer)
    } catch (err: any) {
      console.error("Registration failed:", err)
      console.error("Error response:", err.response?.data)
      console.error("Error message:", err.message)

      // Handle specific error cases
      if (err.response?.data?.message?.includes("already exists")) {
        setError("Email already exists. Try logging in instead or use a different email.")
      } else {
        setError(err.message || "Registration failed")
      }
    }
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

            {/* Test Instructions */}
            <View className="mb-lg p-md bg-blue-50 rounded">
              <Text text="🧪 Test Instructions:" className="text-blue-800 font-bold mb-1" />
              <Text
                text="• Try: test2@example.com / password123"
                className="text-blue-700 text-xs"
              />
              <Text
                text="• Or: test3@example.com / password123"
                className="text-blue-700 text-xs"
              />
            </View>

            {/* Email Input */}
            <TextField
              value={email}
              onChangeText={setEmail}
              className="mb-md"
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
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

            {/* Error Message */}
            {error ? (
              <View className="mb-md">
                <Text text={error} className="text-red-500 text-center" />
              </View>
            ) : null}

            {/* Login Button */}
            <View className="mb-md">
              <Button
                preset="secondary"
                text={isLoading ? "Logging In..." : "Log In"}
                onPress={handleLogin}
                disabled={isLoading}
              />
            </View>

            {/* Register Button */}
            <View className="mb-lg">
              <Button
                preset="default"
                text={isLoading ? "Registering..." : "Register"}
                onPress={handleSignUp}
                disabled={isLoading}
              />
            </View>

            {/* Auth Status Debug */}
            {isAuthenticated && customer ? (
              <View className="mb-lg p-md bg-green-100 rounded">
                <Text text="✅ Authenticated!" className="text-green-800 text-center font-bold" />
                <Text
                  text={`Welcome ${customer.first_name} ${customer.last_name}`}
                  className="text-green-700 text-center"
                />
                <Text
                  text={`Email: ${customer.email}`}
                  className="text-green-600 text-center text-xs"
                />
              </View>
            ) : null}

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
