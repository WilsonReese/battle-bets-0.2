import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { router } from "expo-router";
import { useToastMessage } from "../hooks/useToastMessage";
import api from "../utils/axiosConfig";
import { Btn } from "../components/general/Buttons/Btn";
import { Txt } from "../components/general/Txt";

export default function SignupScreen() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const { showError, showSuccess } = useToastMessage();

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignup = async () => {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      password_confirmation,
    } = form;

    if (!email || !password || !username) {
      showError("Please fill out all required fields.");
      return;
    }

    try {
      const res = await api.post("/signup", form);
      showSuccess("Account created! You can now log in.");
      router.push("/login");
    } catch (err) {
      console.error("Signup failed", err?.response?.data || err.message);
      showError("Signup failed. Please check your input.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={s.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={s.innerContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Txt style={s.title}>Create Account</Txt>

          <TextInput
            placeholder="First Name"
            placeholderTextColor="#B8C3CC"
            style={s.input}
            value={form.first_name}
            onChangeText={(val) => handleChange("first_name", val)}
          />

          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#B8C3CC"
            style={s.input}
            value={form.last_name}
            onChangeText={(val) => handleChange("last_name", val)}
          />

          <TextInput
            placeholder="Username"
            placeholderTextColor="#B8C3CC"
            style={s.input}
            value={form.username}
            onChangeText={(val) => handleChange("username", val)}
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#B8C3CC"
            style={s.input}
            value={form.email}
            onChangeText={(val) => handleChange("email", val)}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#B8C3CC"
            style={s.input}
            secureTextEntry
            value={form.password}
            onChangeText={(val) => handleChange("password", val)}
          />

          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#B8C3CC"
            style={s.input}
            secureTextEntry
            value={form.password_confirmation}
            onChangeText={(val) => handleChange("password_confirmation", val)}
          />

          <Btn
            btnText="Create Account"
            onPress={handleSignup}
            isEnabled={true}
            style={s.submitButton}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  input: {
    height: 48,
    backgroundColor: "#1B2730",
    borderColor: "#3A454D",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    color: "#F8F8F8",
    fontSize: 14,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
});
