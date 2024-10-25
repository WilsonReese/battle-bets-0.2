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
import {
  BetProvider,
  useBetContext,
} from "../../../../../../components/contexts/BetContext";
import { LoadingIndicator } from "../../../../../../components/general/LoadingIndicator";
import api from "../../../../../../utils/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BattleDetails() {
  const { id: poolId, battleId, betslipId } = useLocalSearchParams();
  const [isBetSlipShown, setIsBetSlipShown] = useState(true);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const { bets, setBets, loadStoredBets, storeBets, loadBetsFromBackend, loadBets } = useBetContext(); // Access context function
  // const [bets, setBets] = useState([]);
  // const { setBets } = useBetContext();

  // Function to fetch games for the current battle
  const fetchGames = async () => {
    try {
      const response = await api.get(`/games`, {
        params: { battle_id: battleId },
      });
      setGames(response.data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  // Function to load bets from AsyncStorage
  // const loadBets = async () => {
  //   try {
  //     const storedBets = await AsyncStorage.getItem(`bets-${battleId}`);

  //     if (storedBets) {
  //       console.log(`Loading bets for battle ${battleId}`);
  //       await loadStoredBets(battleId); // Load bets for this battle
  //     } else {
  //       console.log("No stored bets, loading from backend...");
  //       await loadBetsFromBackend(poolId, battleId, betslipId);
  //     }
  //   } catch (error) {
  //     console.error("Error loading bets:", error);
  //   }
  // };

  // useEffect to trigger fetching games and loading bets on mount
  useEffect(() => {
    const initializeBattleData = async () => {
      setLoading(true);
      await fetchGames();
      await loadBets(poolId, battleId, betslipId);
      setLoading(false);
    };

    initializeBattleData();
    // return () => {
    //   console.log(`Clearing bets for battle ${battleId}`);
    //   setBets([]);
    // };
  }, [battleId]);

  // useEffect to store bets in AsyncStorage whenever they change
  useEffect(() => {
    const storeUpdatedBets = async () => {
      if (bets.length > 0) {
        // console.log(`Storing bets for battle ${battleId}`);
        await storeBets(battleId, bets);
      } else {
        console.log(`No bets to store for battle ${battleId}`);
        await AsyncStorage.removeItem(`bets-${battleId}`);
      }
    };

    storeUpdatedBets();
  }, [bets, battleId]);

  function renderGameCards() {
    return games.map((game) => (
      <View key={game.id}>
        <GameCard game={game} />
      </View>
    ));
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <View style={s.logoHeader}>
          <LogoHeader />
        </View>
        {loading ? (
          <View style={s.loadingContainer}>
            <LoadingIndicator color="light" contentToLoad="games" />
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
