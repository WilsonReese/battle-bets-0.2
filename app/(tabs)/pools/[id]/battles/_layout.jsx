import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function BattlesLayout() {
  return (
    <View style={s.container}>
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Battles' }} />
      <Stack.Screen name="[battleId]/index" options={{ title: 'Battle Details' }} />
    </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});
