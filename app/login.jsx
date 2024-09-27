import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../utils/api"; // Your API base URL
import { Btn } from "../components/general/Buttons/Btn";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            email,
            password,
          },
        }),
      });
  
      const responseText = await response.text(); // Get raw text response
      console.log("Response text:", responseText); // Log response to inspect it
  
      if (response.ok) {
        const data = JSON.parse(responseText); // Try parsing it as JSON
  
        if (data.token) {
          // Store JWT token if it exists
          await SecureStore.setItemAsync('jwt_token', data.token);
          Alert.alert("Login successful!");
          router.replace("/pools"); // Redirect to pools page after login
        } else {
          console.error("No token in response:", data); // Log the response for debugging
          Alert.alert("Login failed. Token missing in response.");
        }
      } else {
        Alert.alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Login error. Please try again.");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Btn
        btnText={"Login"}
        isEnabled={true}
        onPress={handleLogin} // Pass battleId and poolId to the function
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {

  },  
  card: {
    backgroundColor: "#DAE1E5",
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gameDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
