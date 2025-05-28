import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
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
import {
  BetProvider,
  useBetContext,
} from "../../../../../../components/contexts/BetContext";
import { LoadingIndicator } from "../../../../../../components/general/LoadingIndicator";
import api from "../../../../../../utils/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BudgetRow } from "../../../../../../components/BetSelection/BudgetRow";

export default function BattleDetails() {
  const {
    id: poolId,
    leagueSeasonId,
    battleId,
    betslipId,
  } = useLocalSearchParams();
  const [isBetSlipShown, setIsBetSlipShown] = useState(true);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollViewRef = useRef(null);
  const sheetRef = useRef(null);

  const { bets, storeBets, loadBets } = useBetContext(); // Access context function

  // BetSlip information
  // const { height } = Dimensions.get("window");
  // const betSlipHeight = (height * 3) / 5;
  // const betSlipHeadingHeight = 94; // Define the height of the BetSlipHeading component (this controls how much of the betSlip is shown)
  // const animatedHeight = useRef(new Animated.Value(betSlipHeight)).current;

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

  const closeBetSlip = () => {
    sheetRef.current?.collapse(); // or .close() if you want to hide it completely
    setIsBetSlipShown(false);
  };

  // useEffect to trigger fetching games and loading bets on mount
  useEffect(() => {
    const initializeBattleData = async () => {
      setLoading(true);
      await fetchGames();
      await loadBets(poolId, leagueSeasonId, battleId, betslipId, true); // force backend
      setLoading(false);
    };

    initializeBattleData();
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
        {loading ? (
          <View style={s.loadingContainer}>
            <LoadingIndicator color="light" contentToLoad="games" />
          </View>
        ) : (
          <>
            <View style={s.body}>
              <BudgetRow
                isBetSlipShown={isBetSlipShown}
                scrollViewRef={scrollViewRef}
                closeBetSlip={closeBetSlip}
              ></BudgetRow>
              {/* <Txt>Pool {poolId}</Txt>
              <Txt>Betlslip {betslipId}</Txt> */}
              {/* <SpreadAndOUInstructions /> */}
              <ScrollView ref={scrollViewRef} style={s.scrollView}>
                {/* This function renders each of the games */}
                {renderGameCards()}
                {/*This is an empty view that allows the scroll to go down to the bottom */}
                <View style={{ height: 152 }}></View>
              </ScrollView>
            </View>
            <BetSlip
              ref={sheetRef}
              poolId={poolId}
              isBetSlipShown={isBetSlipShown}
              setIsBetSlipShown={setIsBetSlipShown}
              scrollViewRef={scrollViewRef}
              leagueSeasonId={leagueSeasonId}
              betslipId={betslipId}
              battleId={battleId}
              // height={height}
              // betSlipHeight={betSlipHeight}
              // betSlipHeadingHeight={betSlipHeadingHeight}
              // animatedHeight={animatedHeight}
              // toggleBetSlip={toggleBetSlip}
            />
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
