import { View, Text, Button, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../../../../components/general/Txt";
import { LogoHeader } from "../../../../components/LogoHeader/LogoHeader.jsx";
// /workspaces/battle-bets-0.2/components/logoHeader/logoHeader.jsx

export default function PoolDetails() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <View style={s.logoHeader}>
          <LogoHeader/>
        </View>
        <View style={s.body}>
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
    backgroundColor: "#061826",
  },
  logoHeader: {
    // flex: .7,
    backgroundColor: "green"
  },
  body : {
    flex: 1,
    backgroundColor: "blue"
  }
});
