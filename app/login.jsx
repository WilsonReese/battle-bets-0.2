import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../utils/api"; // Your API base URL
import { Btn } from "../components/general/Buttons/Btn";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../components/general/Txt";
import { AuthContext, AuthProvider } from "../components/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext); // Get the login function from context
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
          await login(data.token); // Set the token globally and in SecureStore
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
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={s.container}>
          <View style={s.logoPlaceholder}>
            <Txt>Logo Placeholder</Txt>
          </View>
          <View style={s.loginContainer}>
            <View style={s.textInputContainer}>
              <TextInput
                style={s.inputText}
                placeholder="Email"
                placeholderTextColor="#B8C3CC"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={s.textInputContainer}>
              <TextInput
                placeholder="Password"
                style={s.inputText}
                placeholderTextColor="#B8C3CC"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
            <Btn
              btnText={"Login"}
              isEnabled={true}
              onPress={handleLogin} // Pass battleId and poolId to the function
              style={s.loginButton}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#061826",
  },
  logoPlaceholder: {
    flex: 1.5,
    height: 100,
    width: 100,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  loginContainer: {
    flex: 3,
  },
  textInputContainer: {
    paddingVertical: 4,
  },
  inputText: {
    fontFamily: "Saira_600SemiBold",
    borderColor: "#3A454D",
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#F8F8F8",
  },
  loginButton: {
    height: 48,
    marginVertical: 4,
  },
});
