import { Stack } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function PoolsLayout() {
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
        <Stack.Screen
          name="create"
          options={{ title: "Create Pool", headerShown: true }}
        />
        <Stack.Screen
          name="[id]"
          options={{ title: "Pool Details", headerShown: true }}
        />
      </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061826'
  },
});
