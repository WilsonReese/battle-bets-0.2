import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function PoolsLayout() {
  return (
    <View style={s.container}>
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Pools', headerShown: true }}/>
      <Stack.Screen name="[id]/index" options={{ title: '', headerShown: false, headerBackTitleVisible: false }}/>
      <Stack.Screen name="create" options={{ title: "Create" }} />
    </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});
