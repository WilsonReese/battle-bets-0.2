import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function PoolDetailsLayout() {
  return (
    <View style={s.container}>
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Pool Overview' }} />
      <Stack.Screen name="picks" options={{ title: 'Picks' }} />
      <Stack.Screen name="standings" options={{ title: 'Standings' }} />
      <Stack.Screen name="battles" options={{ title: 'Battles' }} />
      {/* <Stack.Screen name="battles/[battleId]/index" options={{ title: 'Battle Details' }} /> */}
    </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});
