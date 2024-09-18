import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function PoolsLayout() {
  return (
    <View style={s.container}>
    <Stack>
      <Stack.Screen name="create" options={{ title: 'Create Pool'}} />
      <Stack.Screen name="[id]" options={{ title: 'Pool Details', headerShown: false}} />
      {/* <Stack.Screen name="index" options={{ title: 'Pools' }} /> */}
      {/* <Stack.Screen name="picks" options={{ title: 'Picks' }} />
      <Stack.Screen name="standings" options={{ title: 'Standings' }} /> */}
      {/* <Stack.Screen name="index" options={{ title: 'Pools', headerShown: true }}/>
      <Stack.Screen name="[id]" options={{ title: 'Pool Details', headerShown: false, headerBackTitleVisible: false }}/>
      <Stack.Screen name="create" options={{ title: "Create" }} /> */}
    </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});
