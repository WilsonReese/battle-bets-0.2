import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  AppState,
  RefreshControl,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Txt } from "../components/general/Txt";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Btn } from "../components/general/Buttons/Btn";
import { useToastMessage } from "../hooks/useToastMessage";
import { EmailLink } from "react-native-email-link";
import { openInbox } from "react-native-email-link";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../components/contexts/AuthContext";
import { API_BASE_URL } from "../utils/api";
import { ScrollView } from "react-native-gesture-handler";

export default function EmailConfirmation() {
  const { showError, showSuccess } = useToastMessage();
  const { token, logout, currentUserEmail } = useContext(AuthContext);
  const [userEmail, setUserEmail] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const appState = useRef(AppState.currentState);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/current_user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.email) {
          setUserEmail(data.email);
        }

        return data;
      }
    } catch (err) {
      console.error("Error fetching current user:", err.message);
    }

    return null;
  };

  const checkConfirmation = async () => {
    try {
      const data = await fetchCurrentUser();

      if (data?.confirmed) {
        showSuccess("Account confirmed. Welcome in!");
        router.replace("/pools");
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!userEmail) {
      showError("Email not available. Try refreshing.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: { email: userEmail },
        }),
      });

      if (response.ok) {
        showSuccess("Confirmation link re-sent.");
      } else {
        const data = await response.json();
        showError(data.errors?.[0] || "Failed to resend confirmation.");
      }
    } catch (error) {
      console.error("Resend error:", error.message);
      showError("Could not resend confirmation. Try again.");
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
          showSuccess("Logged out successfully.");

          // Redirect to the login screen
          router.replace("/login");
        } else {
          showError("Logout failed. Please try again.");
        }
      } else {
        showError("You are already logged out.");
      }
    } catch (error) {
      console.error("Logout error:", error.message);
      showError("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
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

  useEffect(() => {
    fetchCurrentUser(); // only fetches + sets email
  }, [token]);

  const onRefresh = () => {
    setRefreshing(true);
    checkConfirmation();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={s.contentContainer}>
            <View style={s.mailContainer}>
              <Txt style={s.titleTxt}>Account created!</Txt>
              <FontAwesome6
                name="envelope-open-text"
                size={150}
                color="#F8F8F8"
              />
              <Txt style={s.txt}>An account confirmation link has been sent to your email.</Txt>
              <Btn
                btnText={"Open Mail App"}
                style={s.btn}
                backgroundColor={"#54D18C"}
                isEnabled={true}
                onPress={openInbox}
              />
              <TouchableOpacity onPress={handleResendConfirmation}>
                <Txt style={s.txt}>Resend Link</Txt>
              </TouchableOpacity>
            </View>
            <View style={s.loginContainer}>
              <TouchableOpacity style={s.loginButton} onPress={handleLogout}>
                <Txt style={s.txt}>Login with a Different Account</Txt>
              </TouchableOpacity>
            </View>
          </View>
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
    // alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 40,
    justifyContent: "space-between",
    // backgroundColor: 'blue'
  },
  mailContainer: {
    // flex: 5,
    alignItems: "center",
    padding: 36,
    // backgroundColor: "green",
  },
  loginContainer: {
    // flex: 2,
    // backgroundColor: "blue",
    // justifyContent: 'center',
    alignItems: "center",
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
    textAlign: 'center',
  },
});
