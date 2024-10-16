import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "@/components/general/Txt";
import { LogoHeader } from "@/components/LogoHeader/LogoHeader.jsx";
import { SpreadAndOUInstructions } from "@/components/bet_instructions/SpreadAndOUInstructions/SpreadAndOUInstructions.jsx";
import { GameCard } from "@/components/GameCard/GameCard.jsx";
import { GAME_DATA } from "@/utils/game-data.js";
import { BetSlip } from "@/components/BetSlip/BetSlip.jsx";
import { useEffect, useRef, useState } from "react";
import { BetProvider } from "../../../../../../components/contexts/BetContext";
import { LoadingIndicator } from "../../../../../../components/general/LoadingIndicator";
import api from "../../../../../../utils/axiosConfig";

export default function BattleDetails() {
  const { id: poolId, battleId, betslipId } = useLocalSearchParams();
  const [isBetSlipShown, setIsBetSlipShown] = useState(true);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null); // Add this line

  useEffect(() => {
    const fetchGames = async () => {
      try {
        if (!battleId) {
          console.error("No battleId provided");
          return;
        }

        const response = await api.get(`/games`, {
          params: { battle_id: battleId }, // assuming id corresponds to battle_id
        });
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [battleId]);

  function renderGameCards() {
    return games.map((game) => (
      <View key={game.id}>
        <GameCard game={game} />
      </View>
    ));
  }

  return (
    <BetProvider battleId={battleId}>
      <SafeAreaProvider>
        <SafeAreaView style={s.container}>
          <View style={s.logoHeader}>
            <LogoHeader />
          </View>
          {loading ? (
            <View style={s.loadingContainer}>
              <LoadingIndicator
                color="light"
                contentToLoad="games"
              />
            </View>
          ) : (
            <>
              <View style={s.body}>
                <Txt>Pool:{poolId}</Txt>
                <Txt>Betlslip:{betslipId}</Txt>
                <SpreadAndOUInstructions />
                <ScrollView ref={scrollViewRef} style={s.scrollView}>
                  {/* This function renders each of the games */}
                  {renderGameCards()}
                  {/*This is an empty view that allows the scroll to go down to the bottom */}
                  <View style={{ height: 152 }}></View>
                </ScrollView>
              </View>
              <View>
                <BetSlip
                  poolId={poolId}
                  isBetSlipShown={isBetSlipShown}
                  setIsBetSlipShown={setIsBetSlipShown}
                  scrollViewRef={scrollViewRef}
                  betslipId={betslipId}
                  battleId={battleId}
                />
              </View>
            </>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
