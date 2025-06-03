import { Stack } from "expo-router";
import { Image } from "react-native";
import { HeaderBackNavigation } from "../../../components/navigation/headerBackNavigation";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        gestureEnabled: true, // 👈 This enables swipe-to-go-back
        gestureResponseDistance: {
          horizontal: 200, // 👈 default is ~25 on iOS; increase to make easier
        },
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
          headerLeft: () => <HeaderBackNavigation />,
          headerShadowVisible: false, // Hide header border
        }}
      />
    </Stack>
  );
}
