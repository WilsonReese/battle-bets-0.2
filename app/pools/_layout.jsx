import { Stack } from "expo-router";

export default function PoolsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "index" }} />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="create" options={{ title: "Create" }} />
    </Stack>
  );
}
