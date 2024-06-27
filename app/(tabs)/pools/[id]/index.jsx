import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../../../../components/general/Txt";
import { LogoHeader } from "../../../../components/LogoHeader/LogoHeader.jsx";
import { SpreadAndOUInstructions } from "../../../../components/bet_instructions/SpreadAndOUInstructions/SpreadAndOUInstructions.jsx";
import { GameCard } from "../../../../components/GameCard/GameCard.jsx";
import { GAME_DATA } from "../../../../utils/game-data.js";
import { BetSlipPreview } from "../../../../components/BetSlip/BetSlipPreview.jsx";
import { useState } from "react";

export default function PoolDetails() {
  const { id } = useLocalSearchParams();
  const gameData = GAME_DATA;
  const [budget, setBudget] = useState(2000);
  const [totalBet, setTotalBet] = useState(0);

  function renderGameCards() {
    return GAME_DATA.map((game) => (
      <View key={game.id}>
        <GameCard game={game} budget={budget} setBudget={setBudget} totalBet={totalBet} setTotalBet={setTotalBet} />
      </View>
    ));
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <View style={s.logoHeader}>
          <LogoHeader />
        </View>
        <View style={s.body}>
          <SpreadAndOUInstructions />
          <Txt>{totalBet}</Txt>
          <ScrollView>
            {/* This function renders each of the games */}
            {renderGameCards()}
            {/*This is an empty view that allows the scroll to go down to the bottom */}
            <View style={{ height: 75 }}></View>

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
        <View style={s.betSlipPreview}>
          <BetSlipPreview budget={budget} totalBet={totalBet} />
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
  body: {
    flex: 1,
    paddingHorizontal: 4,
    // marginBottom:
  },
});
