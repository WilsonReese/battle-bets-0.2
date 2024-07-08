import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "@/components/general/Txt";
import { LogoHeader } from "@/components/LogoHeader/LogoHeader.jsx";
import { SpreadAndOUInstructions } from "@/components/bet_instructions/SpreadAndOUInstructions/SpreadAndOUInstructions.jsx";
import { GameCard } from "@/components/GameCard/GameCard.jsx";
import { GAME_DATA } from "@/utils/game-data.js";
import { BetSlip } from "@/components/BetSlip/BetSlip.jsx";
import { useState } from "react";
import { BetProvider } from "../../../../components/contexts/BetContext";


export default function PoolDetails() {
  const { id } = useLocalSearchParams();
  const [isBetSlipShown, setIsBetSlipShown] = useState(true);

  function renderGameCards() {
    return GAME_DATA.map((game) => (
      <View key={game.id}>
        <GameCard game={game} />
      </View>
    ));
  }

  return (
    <BetProvider>
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <View style={s.logoHeader}>
          <LogoHeader />
        </View>
        <View style={s.body}>
          <SpreadAndOUInstructions />
          <ScrollView style={s.scrollView}>
            {/* This function renders each of the games */}
            {renderGameCards()}
            {/*This is an empty view that allows the scroll to go down to the bottom */}
            <View style={{ height: 88 }}></View>

            {/* <Txt style={{ fontFamily: "Saira_700Bold" }}>
              All the games listed here
            </Txt>
            <Txt>Pool Details Screen - Pool ID: {id}</Txt>
            <Button
              title="View Standings"
              onPress={() => router.push(`/pools/${id}/standings`)}
            />
            <Button
              title="View Picks"
              onPress={() => router.push(`/pools/${id}/picks`)}
            /> */}
          </ScrollView>
        </View>
        <View>
          <BetSlip poolName={id} isBetSlipShown={isBetSlipShown} setIsBetSlipShown={setIsBetSlipShown} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
    </BetProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  scrollView: {
    padding: 4,
  },
  logoHeader: {
    paddingBottom: 8,
  },
  body: {
    flex: 1,
    paddingHorizontal: 4,
    // marginBottom:
  },
});
