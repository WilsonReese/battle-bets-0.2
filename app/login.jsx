import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "../utils/api";
import { Btn } from "../components/general/Buttons/Btn";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../components/general/Txt";
import { AuthContext } from "../components/contexts/AuthContext";
import { useToastMessage } from "../hooks/useToastMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const { showSuccess, showError } = useToastMessage();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: { email, password },
        }),
      });

      const responseText = await response.text();

      if (response.ok) {
        const data = JSON.parse(responseText);

        if (data.token) {
          await login(data.token);
          showSuccess("Login successful!");
          router.replace("/pools");
        } else {
          showError("Login failed: Token missing.");
        }
      } else {
        showError("Username and password do not match.");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      showError("Login error. Please try again.");
    }
  };

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={s.container}>
          <View style={s.logoPlaceholder}>
            <Image
              style={s.image}
              source={require("@/assets/images/logo_v1.png")}
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
            <TouchableOpacity style={s.forgotPassword}>
              <Txt style={s.forgotPasswordTxt}>Forgot Password?</Txt>
            </TouchableOpacity>
            <Btn
              btnText="Login"
              isEnabled={true}
              onPress={handleLogin}
              style={s.loginButton}
            />

            <TouchableOpacity
              style={s.signUpContainer}
              onPress={() => router.push("/signup")}
            >
              <Txt style={s.signUpTxt}>Create Account</Txt>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.signUpContainer}
              onPress={() => router.replace("/emailConfirmation")}
            >
              <Txt style={s.loginTxt}>Email Confirmation Page</Txt>
            </TouchableOpacity>
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
  forgotPassword: {
    paddingTop: 6,
    paddingBottom: 12,
    // alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  forgotPasswordTxt: {
    fontFamily: "Saira_400Regular_Italic",
    fontSize: 14,
    // color: '#B8C3CC'
  },
  signUpContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  signUpTxt: {
    // color: '#B8C3CC'
  },
});
