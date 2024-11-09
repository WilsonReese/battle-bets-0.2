import { Stack } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function PoolsLayout() {
  return (
    <View style={s.container}>
      <Stack
        screenOptions={{
          headerShown: false, //changes Pools page and all children, overridden by one below
          headerStyle: {
            backgroundColor: "#061826", // BLUE FOR DEBUGGING Set custom background color
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
        {/* Main pool screen with header shown */}
        <Stack.Screen
          name="index"
          options={{
            title: "Pools",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="create"
          options={{ title: "Create Pool", headerShown: true }}
        />
        <Stack.Screen
          name="[id]"
          options={{ title: "Pool Details", headerShown: false }} // changes blue on Pool Details and all children
        />
      </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
  },
});
