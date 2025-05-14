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
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useToastMessage } from "../hooks/useToastMessage";
import api from "../utils/axiosConfig";
import { Btn } from "../components/general/Buttons/Btn";
import { Txt } from "../components/general/Txt";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  function validateSignupForm({ username, password }) {
    const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]{2,19}$/;
    const passwordRegex = /^[^\s]{8,}$/; // No spaces, at least 8 chars

    const errors = [];

    if (!usernameRegex.test(username)) {
      errors.push(
        "• Username must be 3–20 characters, use letters/numbers/underscores only, and start with a letter or underscore."
      );
    }

    if (!passwordRegex.test(password)) {
      errors.push(
        "• Password must be at least 8 characters with no spaces."
      );
    }

    return errors;
  }

  const handleSignup = async () => {
    const {
      first_name,
      last_name,
      username,
      email,
      password,
      password_confirmation,
    } = form;

    if (
      !email ||
      !password ||
      !username ||
      !first_name ||
      !last_name ||
      !password_confirmation
    ) {
      showError("Please fill out all required fields.");
      return;
    }

    const validationErrors = validateSignupForm(form);
    if (validationErrors.length > 0) {
      showError(validationErrors.join("\n"));
      return;
    }

    // Constraints on any of the fields (password length, password values)

    try {
      const res = await api.post("/signup", { user: form });
      showSuccess("Account created! You can now log in.");
      router.push("/login");
    } catch (err) {
      console.error("Signup failed", err?.response?.data || err.message);
      const errors = err?.response?.data?.errors;

      if (errors) {
        const formattedErrors = Object.entries(errors)
          .map(
            ([field, messages]) =>
              `• ${capitalize(field)} ${messages.join(", ")}`
          )
          .join("\n");

        showError(formattedErrors);
      } else {
        showError("Signup failed. Please check your input.");
      }
    }
  };

  return (
    <SafeAreaProvider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={s.container}>
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

                <Txt>Email</Txt>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#B8C3CC"
                  style={s.input}
                  value={form.email}
                  onChangeText={(val) => handleChange("email", val)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />

                <Txt>Password</Txt>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#B8C3CC"
                  style={s.input}
                  secureTextEntry
                  value={form.password}
                  onChangeText={(val) => handleChange("password", val)}
                />

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

                <Btn
                  btnText="Create Account"
                  onPress={handleSignup}
                  isEnabled={true}
                  style={s.submitButton}
                />
                <TouchableOpacity onPress={() => router.back()}>
                  <Txt>Back to Login</Txt>
                </TouchableOpacity>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
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
  submitButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
});
