import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Alert } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Txt } from "../../../../components/general/Txt.jsx";
import { StatusBar } from "expo-status-bar";
import { Btn } from "../../../../components/general/Buttons/Btn.jsx";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoadingIndicator } from "../../../../components/general/LoadingIndicator.jsx";
import api from "../../../../utils/axiosConfig.js";
import { Leaderboard } from "../../../../components/Leaderboard/Leaderboard.jsx";
import { LogoHeader } from "@/components/LogoHeader/LogoHeader.jsx";
import { BattleCard } from "../../../../components/BattleCard/BattleCard.jsx";
import { format } from "date-fns";
import { PreviousBattles } from "../../../../components/PreviousBattles/PreviousBattles.jsx";

export default function PoolDetails() {
  const { id: poolId } = useLocalSearchParams();
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBetslip, setUserBetslip] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);

  const fetchSeasons = async () => {
    try {
      const response = await api.get(`/pools/${poolId}/league_seasons`);
      const allLeagueSeasons = response.data;

      console.log("League Seasons:", allLeagueSeasons);

      // Will need to update this to allow for the user to select the season and have a default
      // Hard code to 2024 for now 
      const desiredSeason = allLeagueSeasons.find(
        (leagueSeason) => leagueSeason.season.year === 2024
      );

      if (!desiredSeason) {
        console.error("No league season found for 2024.");
        Alert.alert("Error", "No active league season found.");
        setLoading(false);
        return;
      }

      console.log('Desired Season:', desiredSeason)

      setSelectedSeason(desiredSeason);
    } catch (error) {
      console.error("Error fetching league seasons:", error.response || error);
      Alert.alert("Error", "Failed to fetch league seasons.");
    }
  };

  // Function to fetch battles and determine the latest one
  const fetchBattles = async () => {
    if (!selectedSeason) {
      Alert.alert("Error", "Please select a season first.");
      return;
    }

    try {
      const battlesResponse = await api.get(
        `/pools/${poolId}/league_seasons/${selectedSeason.id}/battles`
      );
      const fetchedBattles = battlesResponse.data;

      if (fetchedBattles.length === 0) {
        console.error("No battles found for this pool.");
        Alert.alert(
          "No battles",
          "There are no battles available for this pool."
        );
        setLoading(false);
        return;
      }

      setBattles(fetchedBattles);

      const latestBattle = fetchedBattles[0];
      const betslipsResponse = await api.get(
        `/pools/${poolId}/league_seasons/${selectedSeason.id}/battles/${latestBattle.id}/betslips?user_only=true`
      );
      const foundUserBetslip = betslipsResponse.data;

      setUserBetslip(foundUserBetslip);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching battles:", error.response || error);
      setLoading(false);
      Alert.alert("Error", "Failed to fetch battles.");
    }
  };

  // useEffect to fetch battles when the component mounts
  // useEffect(() => {
  //   fetchBattles();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSeasons();
    }, [])
  );
  
  useFocusEffect(
    useCallback(() => {
      if (selectedSeason) {
        fetchBattles();
      }
    }, [selectedSeason])
  );

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
        <StatusBar style="light" />
        <View style={s.titleContainer}>
          <Txt style={s.titleText}>
            {/* This will need to become the Pool Name */}
            Pool {poolId} (Make Dropdown)
          </Txt>
        </View>
        <BattleCard
          userBetslip={userBetslip}
          poolId={poolId}
          season={selectedSeason}
          battle={latestBattle}
          setBattles={setBattles}
          setUserBetslip={setUserBetslip}
          setLoading={setLoading}
        />
        <Txt style={s.titleText}>Standings</Txt>
        <PreviousBattles battles={battles} />
        <Txt style={s.titleText}>League Manager (for commish)</Txt>
        <Txt>Invite Players (modal/form to add players)</Txt>
        <Txt>Pending Players (email, has acct?, sent when?, cancel invite)</Txt>
        <Txt style={s.titleText}>Previous Seasons</Txt>
        <Txt>
          Probably just a drop down to select a previous season (if there is a
          previous season)
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
    marginHorizontal: 8,
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
    // paddingTop: 8,
  },
  titleText: {
    color: "#F8F8F8",
    fontSize: 24,
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
