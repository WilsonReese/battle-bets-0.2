import { Stack } from "expo-router";

export default function ScoreboardLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Scoreboard" }} />
    </Stack>
  );
}