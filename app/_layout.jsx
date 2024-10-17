import { Stack } from "expo-router/stack";
import { StyleSheet, View } from "react-native";
import { AuthProvider } from "../components/contexts/AuthContext";
import { BetProvider } from "../components/contexts/BetContext";

export default function Layout() {
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
