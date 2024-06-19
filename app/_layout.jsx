import { Stack } from "expo-router/stack";
import { StyleSheet, View } from "react-native";

export default function Layout() {
  return (
    <View style={s.container} >
      <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' }}}>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green', // Your global background color
  },
});