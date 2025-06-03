// export const unstable_settings = {
//   initialRouteName: "index",
// };

import { Stack } from "expo-router/stack";
import { Image, StyleSheet, View } from "react-native";
import { AuthProvider } from "../components/contexts/AuthContext";
import { BetProvider } from "../components/contexts/BetContext";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Saira_100Thin,
  Saira_200ExtraLight,
  Saira_300Light,
  Saira_400Regular,
  Saira_400Regular_Italic,
  Saira_500Medium,
  Saira_600SemiBold,
  Saira_700Bold,
  Saira_800ExtraBold,
  Saira_900Black,
} from "@expo-google-fonts/saira";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MessageProvider } from "../components/contexts/MessageContext";
import { useToastMessage } from "../hooks/useToastMessage";
import { Message } from "../components/general/Message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDeepLinkHandler } from "../hooks/useDeepLinkHandler";
import { PoolDetailsProvider } from "../components/contexts/PoolDetailsContext";

SplashScreen.preventAutoHideAsync();

// Global toast renderer component
function GlobalMessageRenderer() {
  const { message, clearMessage } = useToastMessage();
  const insets = useSafeAreaInsets();

  if (!message) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: insets.top + 20, // 12px below safe area
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Message
        message={message.text}
        color={message.color}
        duration={message.duration}
        location={0}
        onHide={clearMessage}
      />
    </View>
  );
}

export default function Layout() {
  // useDeepLinkHandler();

  const [fontsLoaded] = useFonts({
    Saira_100Thin,
    Saira_200ExtraLight,
    Saira_300Light,
    Saira_400Regular,
    Saira_400Regular_Italic,
    Saira_500Medium,
    Saira_600SemiBold,
    Saira_700Bold,
    Saira_800ExtraBold,
    Saira_900Black,
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MessageProvider>
        <BetProvider>
          <AuthProvider>
            <DeepLinkWrapper />
            <PoolDetailsProvider>
              <View style={s.container}>
                <GlobalMessageRenderer />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "transparent" },
                    gestureEnabled: true, // 👈 This enables swipe-to-go-back
                    gestureResponseDistance: {
                      horizontal: 100, // 👈 default is ~25 on iOS; increase to make easier
                    },
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerShown: false,
                      headerTitle: () => (
                        <Image
                          source={require("@/assets/images/white_logo.png")}
                          style={{ width: 140, height: 40 }}
                          resizeMode="contain"
                        />
                      ),
                      headerStyle: {
                        backgroundColor: "#061826",
                        alignItems: "flex-start",
                      },
                      headerTintColor: "#F8F8F8",
                      headerShadowVisible: false,
                    }}
                  />
                </Stack>
              </View>
            </PoolDetailsProvider>
          </AuthProvider>
        </BetProvider>
      </MessageProvider>
    </GestureHandlerRootView>
  );
}

function DeepLinkWrapper() {
  useDeepLinkHandler();
  return null;
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});
