import { Stack } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function PoolDetailsLayout() {
  return (
    <View style={s.container}>
      <Stack
        screenOptions={{
          // animation: "slide_from_left", // Applies to all screens under /pools
          headerShown: false, //overridden by the one below, changes Pool Details
          headerStyle: {
            backgroundColor: "#061826", // GREEN FOR DEBUGGING - Set custom background color #061826
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
        {/* Pool overview page */}
        <Stack.Screen
          name="index"
          options={{ title: "Pool Overview", headerShown: true }} // Changes green on Pool Details
        />

        {/* Specific pool picks and standings */}
        <Stack.Screen name="picks" options={{ title: "Picks" }} />
        <Stack.Screen name="standings" options={{ title: "Standings" }} />

        {/* Battles section */}
        <Stack.Screen
          name="battles"
          options={{
            title: "Battles",
            headerShown: false,
            headerLeft: () => null,
            headerBackTitleVisible: false,
            headerBackTitle: "Back",
            headerBackTitleStyle: {
              color: "blue",
              fontFamily: "Saira_400Regular",
            },
          }} // Changes green on Battle Details (but not Pool Details)
        />

        {/* Dynamic battle detail page */}
        {/* <Stack.Screen name="battles/[battleId]" options={{ title: 'Battle Details' }} /> */}
      </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});
