import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "@/components/general/Txt";
import { LogoHeader } from "@/components/LogoHeader/LogoHeader.jsx";
import { SpreadAndOUInstructions } from "@/components/bet_instructions/SpreadAndOUInstructions/SpreadAndOUInstructions.jsx";
import { GameCard } from "@/components/GameCard/GameCard.jsx";
import { GAME_DATA } from "@/utils/game-data.js";
import { BetSlip } from "@/components/BetSlip/BetSlip.jsx";
import { useEffect, useRef, useState } from "react";
import { BetProvider } from "../../../../components/contexts/BetContext";
import axios from 'axios';


export default function PoolDetails() {
  const { id } = useLocalSearchParams();
  const [isBetSlipShown, setIsBetSlipShown] = useState(true);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null); // Add this line

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`https://refactored-lamp-xx7r46x4jw6c947-3000.app.github.dev/games`, {
          params: { battle_id: 2 },  // assuming id corresponds to battle_id
        });
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  function renderGameCards() {
    return games.map((game) => (
      <View key={game.id}>
        <GameCard game={game} />
      </View>
    ));
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
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
          <ScrollView ref={scrollViewRef} style={s.scrollView}>
            {/* This function renders each of the games */}
            {renderGameCards()}
            {/*This is an empty view that allows the scroll to go down to the bottom */}
            <View style={{ height: 152 }}></View>
          </ScrollView>
        </View>
        <View>
          <BetSlip poolName={id} isBetSlipShown={isBetSlipShown} setIsBetSlipShown={setIsBetSlipShown} scrollViewRef={scrollViewRef} />
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
