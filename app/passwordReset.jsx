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
  const [fieldErrors, setFieldErrors] = useState({});
  const [cooldown, setCooldown] = useState(0);

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

  const validatePasswordResetForm = (password, passwordConfirmation) => {
    const errors = {};

    // Required
    if (!password.trim()) {
      errors.password = ["is required."];
    }

    if (!passwordConfirmation.trim()) {
      errors.password_confirmation = ["is required."];
    }

    // Format
    const passwordRegex = /^[^\s]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      errors.password = errors.password || [];
      errors.password.push("must be at least 8 characters with no spaces.");
    }

    // Match
    if (password && passwordConfirmation && password !== passwordConfirmation) {
      errors.password_confirmation = errors.password_confirmation || [];
      errors.password_confirmation.push("does not match the password.");
    }

    return errors;
  };

  const startCooldown = (seconds) => {
    setCooldown(seconds);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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

      const data = await response.json();

      if (response.ok) {
        showSuccess("Reset link sent to email.");
        startCooldown(10); // ⏳ start 10-second countdown
      } else if (response.status === 404) {
        showError("No account associated with this email.");
      } else {
        showError(data.errors?.[0] || "Could not send reset link.");
      }
    } catch (err) {
      console.error("Reset request failed:", err.message);
      showError("Failed to request reset.");
    }
  };

  const handlePasswordUpdate = async () => {
    const errors = validatePasswordResetForm(newPassword, confirmPassword);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

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
        showSuccess("Password updated.");
        router.replace("/login");
      } else {
        const error = await res.json();
        showError("Failed to update password.");
      }
    } catch (err) {
      console.error("Password update failed:", err.message);
      showError("Something went wrong.");
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C7CDD1"/>
          }
          keyboardShouldPersistTaps="handled"
        >
          {resettingPassword ? (
            <>
              <Txt style={s.txt}>Set a new password.</Txt>
              <TextInput
                key="new-password"
                placeholder="New Password"
                placeholderTextColor="#B8C3CC"
                style={s.input}
                secureTextEntry
                onChangeText={(val) => {
                  setNewPassword(val);
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
              />
              {fieldErrors.password && (
                <Txt style={s.inlineError}>
                  Password {fieldErrors.password.join(", ")}
                </Txt>
              )}

              <TextInput
                key="confirm-password"
                placeholder="Confirm Password"
                placeholderTextColor="#B8C3CC"
                style={s.input}
                secureTextEntry
                onChangeText={(val) => {
                  setConfirmPassword(val);
                  setFieldErrors((prev) => ({
                    ...prev,
                    password_confirmation: undefined,
                  }));
                }}
              />
              {fieldErrors.password_confirmation && (
                <Txt style={s.inlineError}>
                  Password confirmation{" "}
                  {fieldErrors.password_confirmation.join(", ")}
                </Txt>
              )}
              <Btn
                btnText="Save Password"
                isEnabled={true}
                onPress={handlePasswordUpdate}
                style={s.btn}
              />
            </>
          ) : (
            <>
              <Txt style={s.txt}>
                Enter your email to receive a password reset link.
              </Txt>
              <TextInput
                key="email"
                placeholder="Email"
                placeholderTextColor="#B8C3CC"
                style={s.input}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Btn
                btnText={cooldown > 0 ? `Resend in ${cooldown}s` : "Send Reset Link"}
                // btnText='Send Reset Link'
                isEnabled={cooldown === 0}
                // isEnabled={true}
                onPress={handleSendResetEmail}
                style={s.btn}
              />
            </>
          )}
          <TouchableOpacity
            style={s.loginContainer}
            onPress={() => router.replace("/login")}
          >
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
  },
  inlineError: {
    fontFamily: "Saira_400Regular_Italic",
    color: "#E06777",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});
