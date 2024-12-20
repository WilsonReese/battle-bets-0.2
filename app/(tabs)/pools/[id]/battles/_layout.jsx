import { Stack } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function BattlesLayout() {
  return (
    <View style={s.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "red", // Set custom background color
          },
          headerTitleAlign: "center", // Center the title or logo
          headerTitle: () => (
            <Image
              source={require("@/assets/images/white_logo.png")} // Path to your logo
              style={{ width: 140, height: 40 }}
              resizeMode="contain"
            />
          ),
          headerTintColor: "#F8F8F8", // Text color
          headerShadowVisible: false, // Hide header border
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        {/* List of battles for the pool */}
        <Stack.Screen
          name="index"
          options={{ title: "Battle List", headerShown: false }}
        />

        {/* Dynamic battle details ||| Below changes the Battle Details Page */}
        <Stack.Screen
          name="[battleId]/index"
          options={{ title: "Battle Details", headerShown: false }}
        />
      </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});
