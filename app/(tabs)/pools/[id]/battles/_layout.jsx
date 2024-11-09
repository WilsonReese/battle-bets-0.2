import { Stack } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function BattlesLayout() {
  return (
    <View style={s.container}>
            <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#061826", // Set custom background color
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
          headerBackTitleVisible: false, // Hide back button text
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        {/* List of battles for the pool */}
        <Stack.Screen name="index" options={{ title: 'Battle List', headerShown: true}} />
        
        {/* Dynamic battle details */}
        <Stack.Screen name="[battleId]/index" options={{ title: 'Battle Details', headerShown: true}} />
      </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});
