import { View, Text, Button, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../../../../components/general/Txt";

export default function PoolDetails() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaProvider>
      
      <SafeAreaView style={s.container}>
        <View>
          <Txt>Pool Details Screen - Pool ID: {id}</Txt>
          <Button
            title="View Standings"
            onPress={() => router.push(`/pools/${id}/standings`)}
          />
          <Button
            title="View Picks"
            onPress={() => router.push(`/pools/${id}/picks`)}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
  },
});
