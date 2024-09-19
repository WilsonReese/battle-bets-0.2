import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function PoolDetailsLayout() {
  return (
    <View style={s.container}>
      <Stack>
        {/* Pool overview page */}
        <Stack.Screen name="index" options={{ title: 'Pool Overview' }} />
        
        {/* Specific pool picks and standings */}
        <Stack.Screen name="picks" options={{ title: 'Picks' }} />
        <Stack.Screen name="standings" options={{ title: 'Standings' }} />

        {/* Battles section */}
        <Stack.Screen name="battles" options={{ title: 'Battles', headerShown: false} } />
        
        {/* Dynamic battle detail page */}
        {/* <Stack.Screen name="battles/[battleId]" options={{ title: 'Battle Details' }} /> */}
      </Stack>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
});
