import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  AppState,
} from "react-native";
import { Txt } from "../components/general/Txt";
import { Btn } from "../components/general/Buttons/Btn";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../utils/api";
import { AuthContext } from "../components/contexts/AuthContext";
import { router } from "expo-router";

export default function PasswordReset() {
  const { token, currentUserId } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const appState = useRef(AppState.currentState);

  const checkResetStatus = async () => {
    if (!email) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/user_reset_status?email=${email}`
      );
      const data = await response.json();
      setResettingPassword(data.resetting_password);
    } catch (err) {
      console.error("Failed to check reset status", err);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        checkResetStatus();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [email]);

  // On mount, check if user is in reset mode
  useEffect(() => {
    const checkStatus = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/current_user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.resetting_password) {
          setResettingPassword(true);
          setEmail(data.email); // prefill known email
        }
      } catch (err) {
        console.error("Error checking reset status:", err.message);
      }
    };

    checkStatus();
  }, [token]);

  const handleSendResetEmail = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email } }),
      });

      if (response.ok) {
        Alert.alert("Reset link sent", "Check your email for the link.");
      } else {
        Alert.alert("Error", "Could not send reset email.");
      }
    } catch (err) {
      console.error("Reset request failed:", err.message);
      Alert.alert("Error", "Failed to request reset.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/password/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      if (res.ok) {
        Alert.alert("Success", "Password updated.");
        router.replace("/login");
      } else {
        const error = await res.json();
        Alert.alert("Error", error.errors?.[0] || "Failed to update password.");
      }
    } catch (err) {
      console.error("Password update failed:", err.message);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        {resettingPassword ? (
          <>
            <Txt>Set a new password for {email}</Txt>
            <TextInput
              placeholder="New Password"
              style={s.input}
              secureTextEntry
              onChangeText={setNewPassword}
            />
            <TextInput
              placeholder="Confirm Password"
              style={s.input}
              secureTextEntry
              onChangeText={setConfirmPassword}
            />
            <Btn
              btnText="Save Password"
              isEnabled={true}
              onPress={handlePasswordUpdate}
            />
          </>
        ) : (
          <>
            <Txt>Enter your email to reset your password</Txt>
            <TextInput
              placeholder="Email"
              style={s.input}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Btn
              btnText="Send Reset Link"
              isEnabled={true}
              onPress={handleSendResetEmail}
            />
          </>
        )}
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Txt>Back to login</Txt>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
    justifyContent: "center",
    padding: 24,
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    fontSize: 16,
  },
});
