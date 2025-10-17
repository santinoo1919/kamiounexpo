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

export const NewLoginScreen = () => {
  const { theme } = useAppTheme()
  const { setAuthToken } = useAuth()
  const { login, register, isLoading, isAuthenticated, customer } = useAuthStore()
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
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
      console.log("Register:", { email, password, firstName, lastName })

      // Validate required fields
      if (!firstName.trim() || !lastName.trim()) {
        setError("First name and last name are required")
        return
      }

      // Use real auth store for registration
      await register({
        email,
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
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
            <Text
              preset="heading"
              text={showSignUp ? "Create Account" : "Welcome Back"}
              className="text-center"
            />
            <Text
              preset="default"
              text={showSignUp ? "Sign up for a new account" : "Sign in to your account"}
              className="mb-lg text-center"
              style={{ color: theme.colors.textDim }}
            />

            {/* First Name Input - Only for Sign Up */}
            {showSignUp && (
              <TextField
                value={firstName}
                onChangeText={setFirstName}
                className="mb-md"
                label="First Name"
                placeholder="Enter your first name"
                autoCapitalize="words"
                autoCorrect={false}
              />
            )}

            {/* Last Name Input - Only for Sign Up */}
            {showSignUp && (
              <TextField
                value={lastName}
                onChangeText={setLastName}
                className="mb-md"
                label="Last Name"
                placeholder="Enter your last name"
                autoCapitalize="words"
                autoCorrect={false}
              />
            )}

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

            {/* Remember Me Checkbox - Only for Login */}
            {!showSignUp && (
              <View style={{ marginBottom: theme.spacing.lg }}>
                <Checkbox
                  label="Remember me"
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  labelPosition="right"
                />
              </View>
            )}

            {/* Error Message */}
            {error ? (
              <View className="mb-md">
                <Text text={error} className="text-red-500 text-center" />
              </View>
            ) : null}

            {/* Login/Sign Up Button */}
            <View className="mb-md">
              <Button
                preset="secondary"
                text={
                  isLoading
                    ? showSignUp
                      ? "Creating Account..."
                      : "Logging In..."
                    : showSignUp
                      ? "Sign Up"
                      : "Log In"
                }
                onPress={showSignUp ? handleSignUp : handleLogin}
                disabled={isLoading}
              />
            </View>

            {/* Forgot Password Button - Only for Login */}
            {!showSignUp && (
              <View className="items-center mb-xxl">
                <Button
                  preset="default"
                  text="Forgot Password?"
                  onPress={() => setShowForgotPassword(true)}
                />
              </View>
            )}
          </View>

          {/* Footer Section */}
          <View className="items-center">
            <Text
              text={showSignUp ? "Already have an account?" : "Don't have an account?"}
              className="mb-lg"
            />
            <Button
              preset="primary"
              text={showSignUp ? "Sign In" : "Sign Up"}
              onPress={() => {
                setShowSignUp(!showSignUp)
                setError("")
                // Clear form when switching
                if (!showSignUp) {
                  setFirstName("")
                  setLastName("")
                }
              }}
            />
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
