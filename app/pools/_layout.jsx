import { Stack } from "expo-router";

export default function PoolsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "index" }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Pool Details' }}/>
      <Stack.Screen name="create" options={{ title: "Create" }} />
			<Stack.Screen name="[id]/picks" options={{ title: "picks" }} />
      <Stack.Screen name="[id]/standings" options={{ title: "standings" }} />
    </Stack>
  );
}
