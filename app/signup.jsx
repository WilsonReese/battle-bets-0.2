import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useToastMessage } from "../hooks/useToastMessage";
import api from "../utils/axiosConfig";
import { Btn } from "../components/general/Buttons/Btn";
import { Txt } from "../components/general/Txt";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../utils/api";
import { AuthContext } from "../components/contexts/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignupScreen() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const { showError, showSuccess } = useToastMessage();
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  function validateSignupForm({
    first_name,
    last_name,
    username,
    email,
    password,
    password_confirmation,
  }) {
    const errors = {};

    // Required fields
    if (!first_name.trim()) errors.first_name = ["is required."];
    if (!last_name.trim()) errors.last_name = ["is required."];
    if (!username.trim()) errors.username = ["is required."];
    if (!email.trim()) errors.email = ["is required."];
    if (!password.trim()) errors.password = ["is required."];
    if (!password_confirmation.trim())
      errors.password_confirmation = ["is required."];

    // Username format (if provided)
    const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]{2,19}$/;
    if (username && !usernameRegex.test(username)) {
      errors.username = errors.username || [];
      errors.username.push(
        "must be 3–20 characters, use letters/numbers/underscores only, and start with a letter or underscore."
      );
    }

    // Password format (if provided)
    const passwordRegex = /^[^\s]{8,}$/;
    if (password && !passwordRegex.test(password)) {
      errors.password = errors.password || [];
      errors.password.push("must be at least 8 characters with no spaces.");
    }

    // Password confirmation match
    if (
      password &&
      password_confirmation &&
      password !== password_confirmation
    ) {
      errors.password_confirmation = errors.password_confirmation || [];
      errors.password_confirmation.push("does not match the password.");
    }

    return errors;
  }

  const handleSignup = async () => {
    setFieldErrors({});

    const validationErrors = validateSignupForm(form);
    const hasMissingRequiredFields = Object.values(validationErrors).some(
      (arr) => arr.includes("is required.")
    );

    if (hasMissingRequiredFields) {
      setFieldErrors(validationErrors);
      return;
    }

    try {
      await api.post("/signup", { user: form });
      showSuccess("Account created!");

      // Try auto-login after successful signup
      await handleLogin(form.email, form.password);
    } catch (err) {
      console.error("Signup failed", err?.response?.data || err.message);
      const errors = err?.response?.data?.errors;

      if (errors) {
        setFieldErrors((prev) => {
          const merged = { ...prev };
          for (const [key, value] of Object.entries(errors)) {
            merged[key] = [...(merged[key] || []), ...value];
          }
          return merged;
        });
      } else {
        showError("Signup failed. Please check your input.");
      }
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email, password } }),
      });

      const responseText = await response.text();

      if (response.ok) {
        const data = JSON.parse(responseText);
        if (data.token) {
          await login(data.token); // from AuthContext
          router.replace("/emailConfirmation");
        } else {
          showError("Login failed: Token missing.");
        }
      } else {
        showError("Login failed. Please check your credentials.");
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
          <KeyboardAwareScrollView
            contentContainerStyle={s.innerContainer}
            extraScrollHeight={60} // tweak this if needed
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
          >
                <Txt style={s.title}>Create Account</Txt>

                <View style={s.nameContainer}>
                  <View style={s.nameElement}>
                    <Txt>First Name</Txt>
                    <TextInput
                      placeholder="First Name"
                      placeholderTextColor="#B8C3CC"
                      autoCapitalize="words"
                      style={s.input}
                      value={form.first_name}
                      onChangeText={(val) => handleChange("first_name", val)}
                    />
                    {fieldErrors.first_name && (
                      <Txt style={s.inlineError}>
                        First name {fieldErrors.first_name.join(", ")}
                      </Txt>
                    )}
                  </View>

                  <View style={s.nameElement}>
                    <Txt style={s.formTxt}>Last Name</Txt>
                    <TextInput
                      placeholder="Last Name"
                      placeholderTextColor="#B8C3CC"
                      autoCapitalize="words"
                      style={s.input}
                      value={form.last_name}
                      onChangeText={(val) => handleChange("last_name", val)}
                    />
                    {fieldErrors.last_name && (
                      <Txt style={s.inlineError}>
                        Last name {fieldErrors.last_name.join(", ")}
                      </Txt>
                    )}
                  </View>
                </View>

                <Txt>Username</Txt>
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#B8C3CC"
                  style={s.input}
                  autoCorrect={false}
                  value={form.username}
                  onChangeText={(val) => handleChange("username", val)}
                  autoCapitalize="none"
                />
                {fieldErrors.username && (
                  <Txt style={s.inlineError}>
                    Username {fieldErrors.username.join(", ")}
                  </Txt>
                )}

                <Txt>Email</Txt>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#B8C3CC"
                  style={s.input}
                  autoCorrect={false}
                  value={form.email}
                  onChangeText={(val) => handleChange("email", val)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {fieldErrors.email && (
                  <Txt style={s.inlineError}>
                    Email {fieldErrors.email.join(", ")}
                  </Txt>
                )}

                <Txt>Password</Txt>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#B8C3CC"
                  style={s.input}
                  secureTextEntry
                  value={form.password}
                  onChangeText={(val) => handleChange("password", val)}
                />
                {fieldErrors.password && (
                  <Txt style={s.inlineError}>
                    Password {fieldErrors.password.join(", ")}
                  </Txt>
                )}

                <Txt>Confirm Password</Txt>
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#B8C3CC"
                  style={s.input}
                  secureTextEntry
                  value={form.password_confirmation}
                  onChangeText={(val) =>
                    handleChange("password_confirmation", val)
                  }
                />
                {fieldErrors.password_confirmation && (
                  <Txt style={s.inlineError}>
                    Password confirmation{" "}
                    {fieldErrors.password_confirmation.join(", ")}
                  </Txt>
                )}

                <Btn
                  btnText="Create Account"
                  onPress={handleSignup}
                  isEnabled={true}
                  style={s.submitButton}
                />
                <TouchableOpacity
                  style={s.loginContainer}
                  onPress={() => router.back()}
                >
                  <Txt style={s.loginTxt}>Back to Login</Txt>
                </TouchableOpacity>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
  },
  innerContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: "#F8F8F8",
    marginBottom: 16,
  },
  nameContainer: {
    flexDirection: "row",
    gap: 8,
  },
  nameElement: {
    flex: 1,
  },
  formTxt: {
    // fontFamily: "Saira_600SemiBold",
  },
  input: {
    fontFamily: "Saira_600SemiBold",
    height: 48,
    // backgroundColor: "#F8F8F8",
    borderColor: "#3A454D",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    color: "#F8F8F8",
    fontSize: 14,
  },
  inlineError: {
    fontFamily: "Saira_400Regular_Italic",
    color: "#E06777",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  loginContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loginTxt: {
    // color: "#B8C3CC",
  },
});
