import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
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
import { MembershipsTable } from "../../../../components/MembershipsTable/MembershipsTable.jsx";
import { Message } from "../../../../components/general/Message";
import { AuthContext } from "../../../../components/contexts/AuthContext.js";

export default function PoolDetails() {
  const { id: poolId } = useLocalSearchParams();
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBetslip, setUserBetslip] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [message, setMessage] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);

  // Checking for commissioners
  const { currentUserId } = useContext(AuthContext);
  const userMembership = memberships.find(
    (m) => String(m.user.id) === String(currentUserId)
  );
  const isCurrentUserCommissioner = userMembership?.is_commissioner;

  // Pagination for league memberships
  // const [page, setPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);

  const showMessage = (text, color = "#54D18C", duration = 2000) => {
    setMessage({ text, color, duration });
  };

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

      console.log("Desired Season:", desiredSeason);

      // Add a flag to determine if battle logic should be fetched
      setSelectedSeason({
        ...desiredSeason,
        hasStarted: desiredSeason["has_started?"],
      });
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

  // for pagination
  // const fetchPoolMemberships = async (pageToFetch = 1) => {
  //   try {
  //     const response = await api.get(`/pools/${poolId}/pool_memberships?page=${pageToFetch}`);
  //     setMemberships(response.data.memberships);
  //     setPage(response.data.current_page);
  //     setTotalPages(response.data.total_pages);
  //   } catch (error) {
  //     console.error("Error fetching pool memberships:", error.response || error);
  //   }
  // };

  const fetchPoolMemberships = async () => {
    try {
      const response = await api.get(`/pools/${poolId}/pool_memberships`);
      setMemberships(response.data); // Expecting just an array of memberships now
      console.log("Memberships: ", response.data);
    } catch (error) {
      console.error(
        "Error fetching pool memberships:",
        error.response || error
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSeasons();
    }, [])
  );

  useEffect(() => {
    if (selectedSeason?.hasStarted) {
      fetchBattles();
    } else if (selectedSeason && !selectedSeason.hasStarted) {
      setLoading(false); // only stop loading once season is confirmed
    }
  }, [selectedSeason]);

  // for pagination
  // useEffect(() => {
  //   if (poolId) {
  //     fetchPoolMemberships(page);
  //   }
  // }, [poolId, page]);

  useEffect(() => {
    if (poolId) {
      fetchPoolMemberships(); // No more page param
    }
  }, [poolId]);

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
      <SafeAreaView
        style={s.container}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setContainerWidth(width);
        }}
      >
        {message && (
          <Message
            message={message.text}
            color={message.color}
            duration={message.duration}
            onHide={() => setMessage(null)}
          />
        )}
        <StatusBar style="light" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.titleContainer}>
            <Txt style={s.titleText}>
              {/* This will need to become the Pool Name */}
              Pool {poolId} (Make Dropdown)
            </Txt>
          </View>
          {selectedSeason?.hasStarted && ( // This will need to be updated for when a season has ended - seasons will need statuses
            <BattleCard
              userBetslip={userBetslip}
              poolId={poolId}
              season={selectedSeason}
              battle={latestBattle}
              setBattles={setBattles}
              setUserBetslip={setUserBetslip}
              setLoading={setLoading}
            />
          )}

          {/* We need to make this a component */}
          <Txt style={s.titleText}>League</Txt>
          <View style={{ marginTop: 16 }}>
            <Txt style={s.titleText}>Members</Txt>
          </View>

          <MembershipsTable
            containerWidth={containerWidth}
            memberships={memberships}
            setMemberships={setMemberships}
            poolId={poolId}
            fetchPoolMemberships={fetchPoolMemberships}
            showMessage={showMessage}
            isCurrentUserCommissioner={isCurrentUserCommissioner}
            // page={page}
            // totalPages={totalPages}
            // setPage={setPage}
          />

          <PreviousBattles battles={battles} />
          <Txt style={s.titleText}>League Manager (for commish)</Txt>
          <Txt>Invite Players (modal/form to add players)</Txt>
          <Txt>
            Pending Players (email, has acct?, sent when?, cancel invite)
          </Txt>
          <Txt style={s.titleText}>Previous Seasons</Txt>
          <Txt>
            Probably just a drop down to select a previous season (if there is a
            previous season)
          </Txt>
        </ScrollView>
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
    flex: 1,
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
