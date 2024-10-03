import { Stack } from "expo-router/stack";
import { StyleSheet, View } from "react-native";
import { AuthProvider } from "../components/contexts/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
    <View style={s.container} >
      <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' }, headerShown: false}}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
    </AuthProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'blue', // Your global background color
  },
});