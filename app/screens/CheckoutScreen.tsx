import React, { useState } from "react"
import { View, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { Screen } from "@/components/Screen"
import { Header } from "@/components/Header"
import { Card } from "@/components/Card"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { Calendar } from "@/components/checkout/Calendar"
import { Notes } from "@/components/checkout/Notes"
import { CartFooter } from "@/components/cart/CartFooter"
import { useCart } from "@/context/CartContext"
import { useAppTheme } from "@/theme/context"

interface CheckoutScreenProps extends AppStackScreenProps<"Checkout"> {}

const CheckoutScreenComponent = ({}: CheckoutScreenProps) => {
  const navigation = useNavigation<AppStackScreenProps<"Checkout">["navigation"]>()
  const { totalItems, totalPrice, clearCart } = useCart()
  const { theme } = useAppTheme()

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [note, setNote] = useState("")

  const handleConfirmOrder = () => {
    if (!selectedDate) {
      // TODO: Show error message
      return
    }

    // Create order object
    const order = {
      id: Date.now().toString(),
      deliveryDate: selectedDate,
      note,
      totalItems,
      totalPrice,
      status: "confirmed",
      createdAt: new Date(),
    }

    // TODO: Save order to storage/API
    console.log("Order confirmed:", order)

    // Clear cart
    clearCart()

    // Navigate to success screen
    navigation.navigate("OrderSuccess", { orderId: order.id })
  }

  return (
    <View className="flex-1">
      {/* Sticky Header */}
      <Header
        title="Checkout"
        RightActionComponent={
          <TouchableOpacity onPress={() => navigation.goBack()} className="px-md py-xs">
            <Text text="✕" size="md" />
          </TouchableOpacity>
        }
      />

      {/* Scrollable Content */}
      <Screen preset="scroll" safeAreaEdges={["bottom"]} className="flex-1">
        <View className="px-md">
          {/* Calendar Component */}
          <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />

          {/* Notes Component */}
          <Notes note={note} onNoteChange={setNote} />
        </View>
      </Screen>

      {/* Footer */}
      <CartFooter
        totalItems={totalItems}
        totalPrice={totalPrice}
        buttonText="Complete Order"
        onButtonPress={handleConfirmOrder}
      />
    </View>
  )
}

export const CheckoutScreen = CheckoutScreenComponent
