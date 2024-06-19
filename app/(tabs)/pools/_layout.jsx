import { Stack } from "expo-router";

export default function PoolsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Pools', headerShown: false }}/>
      <Stack.Screen name="[id]/index" options={{ title: '', headerShown: false, headerBackTitleVisible: false }}/>
      <Stack.Screen name="create" options={{ title: "Create" }} />
			<Stack.Screen name="[id]/picks" options={{ title: "picks" }} />
      <Stack.Screen name="[id]/standings" options={{ title: "standings" }} />
    </Stack>
  );
}
