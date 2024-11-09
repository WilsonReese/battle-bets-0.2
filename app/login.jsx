import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../utils/api"; // Your API base URL
import { Btn } from "../components/general/Buttons/Btn";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../components/general/Txt";
import { AuthContext, AuthProvider } from "../components/contexts/AuthContext";
import { Message } from "../components/general/Message";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // Add state for message
  const { login } = useContext(AuthContext); // Get the login function from context
  const router = useRouter();

  const showMessage = (text, color) => {
    setMessage({ text, color });
  };

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

      if (response.ok) {
        const data = JSON.parse(responseText); // Try parsing it as JSON

        if (data.token) {
          // Store JWT token if it exists
          await login(data.token); // Set the token globally and in SecureStore
          showMessage("Login successful!", "#0C9449");
          router.replace({
            pathname: "/pools",
            params: { successMessage: "Login successful!" },
          });
        } else {
          showMessage("Login failed. Token missing in response.", "#AB1126");
        }
      } else {
        showMessage("Login failed. Please check your credentials.", "#AB1126");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      showMessage("Login error. Please try again.", "#AB1126");
    }
  };

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={s.container}>
          {message && (
            <Message
              message={message.text}
              color={message.color}
              onHide={() => setMessage(null)} // Hide message after duration
            />
          )}
          <View style={s.logoPlaceholder}>
            <Image
              style={s.image}
              source={require("@/assets/images/icon_style_v1.png")}
            />
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
    // backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  image: {
    height: 57.6,
    width: 376.8,
    resizeMode: "contain",
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
