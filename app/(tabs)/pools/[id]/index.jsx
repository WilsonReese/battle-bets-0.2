import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Txt } from "../../../../components/general/Txt.jsx";
import { StatusBar } from "expo-status-bar";
import { Btn } from "../../../../components/general/Buttons/Btn.jsx";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoadingIndicator } from "../../../../components/general/LoadingIndicator.jsx";
import api from "../../../../utils/axiosConfig.js";
import { Leaderboard } from "../../../../components/Leaderboard/Leaderboard.jsx";
import { LogoHeader } from "@/components/LogoHeader/LogoHeader.jsx";
import { BattleCard } from "../../../../components/BattleCard/BattleCard.jsx";

export default function PoolDetails() {
  const { id: poolId } = useLocalSearchParams();
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBetslip, setUserBetslip] = useState(null);

  // Function to fetch battles and determine the latest one
  const fetchBattles = async () => {
    try {
      const battlesResponse = await api.get(`/pools/${poolId}/battles`);
      const fetchedBattles = battlesResponse.data;

      // this portion can be deleted once I set up functionality that handles automatically creating battles
      if (fetchedBattles.length === 0) {
        console.error("No battles found for this pool.");
        Alert.alert(
          "No battles",
          "There are no battles available for this pool."
        );
        setLoading(false);
        return; // Exit the function if there are no battles
      }

      setBattles(fetchedBattles);

      const latestBattle = fetchedBattles[0];
      const betslipsResponse = await api.get(
        `/pools/${poolId}/battles/${latestBattle.id}/betslips?user_only=true`
      );
      const foundUserBetslip = betslipsResponse.data;

      setUserBetslip(foundUserBetslip); // Update the state with the found betslip
      setLoading(false);
    } catch (error) {
      console.error("Error fetching battles:", error.response || error);
      setLoading(false); // Stop loading if there's an error
      Alert.alert("Error", "Failed to fetch battles.");
    }
  };

  // useEffect to fetch battles when the component mounts
  useEffect(() => {
    fetchBattles();
  }, []);

  const latestBattle = battles[0];

  // Render loading spinner while data is being fetched
  if (loading) {
    return (
      <SafeAreaProvider style={s.loadingBackground}>
        <SafeAreaView style={s.loadingContainer}>
          <LoadingIndicator color="light" contentToLoad="battles" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={s.background}>
      <SafeAreaView style={s.container}>
        <StatusBar style="dark" />
        <View style={s.logoHeader}>
          <LogoHeader />
        </View>
        <View style={s.titleContainer}>
          <Txt style={s.titleText}>
            {/* This will need to become the Pool Name */}
            Pool {poolId}
          </Txt>
        </View>
        <BattleCard
          userBetslip={userBetslip}
          poolId={poolId}
          battle={latestBattle}
        />
        <Txt style={s.txt}>List of all battles</Txt>
        {battles.map((battle) => (
          <Txt key={battle.id} style={s.txt}>
            {battle.id}
          </Txt>
        ))}
        <Txt style={s.txt}>
          This screen will show the details of the pool - current battle,
          previous battles, number of users, leaderboards
        </Txt>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  loadingBackground: {
    backgroundColor: "#061826",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    backgroundColor: "#061826",
  },
  background: {
    backgroundColor: "#061826",
  },
  container: {
    justifyContent: "center",
    margin: 8,
  },
  titleContainer: {
    paddingTop: 8,
  },
  titleText: {
    color: "#F8F8F8",
    fontSize: 24,
  },
  currentBattleContainer: {
    // flex: 1,
    // alignItems: "center",
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#3A454D",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#DAE1E5",
  },
  betslipContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    // margin: 4,
  },
  txt: {
    // fontFamily: "Saira_300Light",
    color: "#F8F8F8",
    fontSize: 16,
  },
});
