import { Stack } from "expo-router";
import { Image } from "react-native";
import { HeaderBackNavigation } from "../../../components/navigation/headerBackNavigation";

export default function ScoreboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        headerShown={false}
        options={{
          title: "Scoreboard",
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
        name="[id]"
        options={{
          title: "Game Details", // or dynamic if you want
          headerShown: true,
          headerBackVisible: false,
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
          headerLeft: () => <HeaderBackNavigation />,
        }}
      />
    </Stack>
  );
}
