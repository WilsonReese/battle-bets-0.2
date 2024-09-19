import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function BattlesLayout() {
  return (
    <View style={s.container}>
      <Stack>
        {/* List of battles for the pool */}
        <Stack.Screen name="index" options={{ title: 'Battle List' }} />
        
        {/* Dynamic battle details */}
        <Stack.Screen name="[battleId]/index" options={{ title: 'Battle Details', headerShown: false}} />
      </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});
