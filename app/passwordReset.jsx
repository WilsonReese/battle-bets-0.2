import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  AppState,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Txt } from "../components/general/Txt";
import { Btn } from "../components/general/Buttons/Btn";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../utils/api";
import { AuthContext } from "../components/contexts/AuthContext";
import { router } from "expo-router";
import { useToastMessage } from "../hooks/useToastMessage";

export default function PasswordReset() {
  const { token } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [resettingPassword, setResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  const { showError, showSuccess } = useToastMessage();
  const appState = useRef(AppState.currentState);

  // Unified logic for checking if password reset is active
  const fetchResetStatus = async () => {
    try {
      const url = token
        ? `${API_BASE_URL}/current_user`
        : `${API_BASE_URL}/user_reset_status?email=${email}`;
      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        : {};

      const res = await fetch(url, { headers });
      const data = await res.json();

      if (data.resetting_password) {
        setResettingPassword(true);
        if (data.email) setEmail(data.email);
      } else {
        setResettingPassword(false);
      }
    } catch (err) {
      console.error("Error checking reset status:", err.message);
    }
  };

  // Run on app resume
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        fetchResetStatus();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [token, email]);

  // Run on mount (or token change)
  useEffect(() => {
    fetchResetStatus();
  }, [token]);

  const handleSendResetEmail = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email } }),
      });

      if (response.ok) {
        showSuccess("Reset link sent", "Check your email for the link.");
      } else {
        showError("Error", "Could not send reset email.");
      }
    } catch (err) {
      console.error("Reset request failed:", err.message);
      showError("Error", "Failed to request reset.");
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      showError("Error", "Passwords do not match.");
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
        showSuccess("Success", "Password updated.");
        router.replace("/login");
      } else {
        const error = await res.json();
        showError("Error", error.errors?.[0] || "Failed to update password.");
      }
    } catch (err) {
      console.error("Password update failed:", err.message);
      showError("Error", "Something went wrong.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchResetStatus();
    setRefreshing(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <ScrollView
          style={s.innerContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyboardShouldPersistTaps="handled"
        >
          {resettingPassword ? (
            <>
              <Txt style={s.txt}>Set a new password.</Txt>
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
                style={s.btn}
              />
            </>
          ) : (
            <>
              <Txt style={s.txt}>Enter your email to receive a password reset link.</Txt>
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
                style={s.btn}
              />
            </>
          )}
          <TouchableOpacity style={s.loginContainer} onPress={() => router.replace("/login")}>
            <Txt>Back to login</Txt>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
    justifyContent: "center",
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    // backgroundColor: 'blue',
    paddingVertical: 40,
  },
  btn: {
    paddingVertical: 12,
    marginTop: 16,
  },
  input: {
    fontFamily: "Saira_600SemiBold",
    height: 48,
    // backgroundColor: "#F8F8F8",
    borderColor: "#3A454D",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    // marginTop: 4,
    marginBottom: 12,
    color: "#F8F8F8",
    fontSize: 14,
  },
  loginContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  txt: {
    paddingBottom: 4,
  }
});
