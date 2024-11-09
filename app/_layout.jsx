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
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
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

  if (!fontsLoaded) {
    return null; // Keep the splash screen up until fonts are loaded
  }

  return (
    <BetProvider>
      <AuthProvider>
        <View style={s.container}>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: "transparent" },
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                headerTitle: () => (
                  <Image
                    source={require("@/assets/images/white_logo.png")} // Replace with your logo path
                    style={{ width: 120, height: 40 }} // Adjust the size as needed
                    resizeMode="contain"
                  />
                ),
                headerStyle: {
                  backgroundColor: "#061826", // Set your custom background color
                  alignItems: 'flex-start'
                },
                headerTintColor: "#F8F8F8", // Color for header text/icons
                headerShadowVisible: false, // Hides the bottom border
              }}
            />
          </Stack>
        </View>
      </AuthProvider>
    </BetProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'blue', // Your global background color
  },
});
