import { Stack } from "expo-router";
import { Image } from "react-native";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen
        name="index"
        headerShown={false}
        options={{
          title: "Profile",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#061826", // BLUE FOR DEBUGGING Set custom background color
          },
          headerTitle: () => (
            <Image
              source={require("@/assets/images/white_logo.png")} // Path to your logo
              style={{ width: 140, height: 40 }}
              resizeMode="contain"
            />
          ),
          headerShadowVisible: false, // Hide header border
        }}
      />
      <Stack.Screen
        name="updatePassword"
        headerShown={false}
        options={{
          title: "updatePassword",
          headerBackVisible: false,
          headerShown: true,
          headerStyle: {
            backgroundColor: "#061826", // BLUE FOR DEBUGGING Set custom background color
          },
          headerTitle: () => (
            <Image
              source={require("@/assets/images/white_logo.png")} // Path to your logo
              style={{ width: 140, height: 40 }}
              resizeMode="contain"
            />
          ),
          headerShadowVisible: false, // Hide header border
        }} />
    </Stack>
  );
}
