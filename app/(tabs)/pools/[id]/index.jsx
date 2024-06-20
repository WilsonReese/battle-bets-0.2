import { View, Text, Button, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../../../../components/general/Txt";
import { LogoHeader } from "../../../../components/LogoHeader/LogoHeader.jsx";
import { SpreadAndOUInstructions } from "../../../../components/bet_instructions/SpreadAndOUInstructions/SpreadAndOUInstructions.jsx";

export default function PoolDetails() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <View style={s.logoHeader}>
          <LogoHeader/>
        </View>
        <View style={s.body}>
          <SpreadAndOUInstructions/>
          <Txt style={{fontFamily: "Saira_700Bold"}}>All the games listed here</Txt>
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
        <View style={s.betSlipPreview}>
          <Txt>Bet slip preview</Txt>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
    padding: 8,
  },
  logoHeader: {
    paddingBottom: 8,
  },
  body : {
    flex: 1,
    // backgroundColor: "blue",
    paddingHorizontal: 4,
  },
  betSlipPreview: {
    backgroundColor: "red"
  }
});
