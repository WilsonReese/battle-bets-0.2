import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  AppState,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Txt } from "../components/general/Txt";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Btn } from "../components/general/Buttons/Btn";
import { useToastMessage } from "../hooks/useToastMessage";
import { EmailLink } from "react-native-email-link";
import { openInbox } from "react-native-email-link";
import { useCallback, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../components/contexts/AuthContext";
import { API_BASE_URL } from "../utils/api";

export default function EmailConfirmation() {
  const { showError, showSuccess } = useToastMessage();
  const { token, logout } = useContext(AuthContext);
  const appState = useRef(AppState.currentState);

  const checkConfirmation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/current_user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.confirmed) {
          showSuccess('Account confirmed!')
          router.replace("/pools");
        }
      }
    } catch (error) {
      console.error("Error checking confirmation:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      // Get the token from secure storage XXX --- This is now coming from the AuthContext
      // const token = await SecureStore.getItemAsync('jwt_token');

      if (token) {
        // Make the API request to log out
        const response = await fetch(`${API_BASE_URL}/logout`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // If logout is successful, clear the token from SecureStore
          await logout();
          Alert.alert("Logged out successfully!");

          // Redirect to the login screen
          router.replace("/login");
        } else {
          Alert.alert("Logout failed. Please try again.");
        }
      } else {
        Alert.alert("No token found. You are already logged out.");
      }
    } catch (error) {
      console.error("Logout error:", error.message);
      Alert.alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        checkConfirmation();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <View style={s.mailContainer}>
          <Txt style={s.titleTxt}>Account created!</Txt>
          <FontAwesome6 name="envelope-open-text" size={150} color="#F8F8F8" />
          <Txt style={s.txt}>Check email to confirm account.</Txt>
          <Btn
            btnText={"Open Mail App"}
            style={s.btn}
            backgroundColor={"#54D18C"}
            isEnabled={true}
            onPress={openInbox}
          />
          <TouchableOpacity onPress={checkConfirmation}>
            <Txt style={s.txt}>Refresh</Txt>
          </TouchableOpacity>
          <TouchableOpacity>
            <Txt style={s.txt}>Resend Link</Txt>
          </TouchableOpacity>
        </View>
        <View style={s.loginContainer}>
          <TouchableOpacity style={s.loginButton} onPress={handleLogout}>
            <Txt style={s.txt}>Login with a Different Account</Txt>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
    justifyContent: "center",
    alignItems: "center",
  },
  mailContainer: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 36,
    // backgroundColor: 'green'
  },
  loginContainer: {
    flex: 3,
    // backgroundColor: 'blue',
    // justifyContent: 'center',
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  titleTxt: {
    fontSize: 24,
  },
  loginButton: {
    padding: 16,
  },
  txt: {
    paddingVertical: 6,
  },
});
