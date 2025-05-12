import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Txt } from "../../../../components/general/Txt.jsx";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoadingIndicator } from "../../../../components/general/LoadingIndicator.jsx";
import api from "../../../../utils/axiosConfig.js";
import { Leaderboard } from "../../../../components/Leaderboard/Leaderboard.jsx";
import { LogoHeader } from "@/components/LogoHeader/LogoHeader.jsx";
import { BattleCard } from "../../../../components/BattleCard/BattleCard.jsx";
import { format } from "date-fns";
import { PreviousBattles } from "../../../../components/PreviousBattles/PreviousBattles.jsx";
import { MembershipsTable } from "../../../../components/PoolDetails/MembershipsTable/MembershipsTable.jsx";
import { AuthContext } from "../../../../components/contexts/AuthContext.js";
import { usePoolDetails } from "../../../../hooks/usePoolDetails.js";
import { LeaveLeagueButton } from "../../../../components/PoolDetails/LeaveLeagueButton/LeaveLeagueButton.jsx";
import { useToastMessage } from "../../../../hooks/useToastMessage.js";
import { InviteUsersButton } from "../../../../components/PoolDetails/InviteUsers/InviteUsersButton.jsx";
import { PaginatedFlatList } from "../../../../components/general/PaginatedFlatList.jsx";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { PoolSelectionModal } from "../../../../components/PoolDetails/PoolSelection/PoolSelectionModal.jsx";
import { useStandings } from "../../../../components/contexts/StandingsContext.js";
import { LeagueStandingsTable } from "../../../../components/PoolDetails/LeagueStandings/LeagueStandingsTable.jsx";

export default function PoolDetails() {
  const { id: poolId } = useLocalSearchParams();
  const [containerWidth, setContainerWidth] = useState(null);
  // const [poolDetails, setPoolDetails] = useState(null);

  const {
    inviteToken,
    poolDetails,
    fetchPoolDetails,
    selectedSeason,
    battles,
    setBattles,
    memberships,
    setMemberships,
    userBetslip,
    setUserBetslip,
    fetchSeasons,
    fetchBattles,
    fetchPoolMemberships,
    loading,
    setLoading,
    fetchUserPools,
    userPools,
  } = usePoolDetails(poolId);

  const { userLeaderboardEntries, fetchStandings } = useStandings();
  const { currentUserId } = useContext(AuthContext);
  const userMembership = memberships.find(
    (m) => String(m.user.id) === String(currentUserId)
  );
  const isCurrentUserCommissioner = userMembership?.is_commissioner;
  const [modalVisible, setModalVisible] = useState(false);

  console.log("User Pools: ", userPools);

  useEffect(() => {
    if (poolId) {
      fetchPoolDetails();
    }
  }, [poolId]);

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
        <StatusBar style="light" />
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={s.titleContainer}
            onPress={() => {
              setModalVisible(true);
              fetchUserPools();
            }}
          >
            <Txt style={s.titleText}>
              {/* This will need to become the Pool Name */}
              {poolDetails.name}
            </Txt>
            <FontAwesome6 name="caret-down" size={24} color="#54D18C" />
          </TouchableOpacity>
          {selectedSeason?.hasStarted && battles.length > 0 && (
            <>
              <PaginatedFlatList
                data={battles}
                itemsPerPage={1}
                containerWidth={containerWidth}
                renderItemRow={(battle) => (
                  <BattleCard
                    key={battle.id}
                    userBetslip={userBetslip}
                    poolId={poolId}
                    season={selectedSeason}
                    battle={battle}
                    setBattles={setBattles}
                    setUserBetslip={setUserBetslip}
                    setLoading={setLoading}
                  />
                )}
              />
            </>
          )}

          <LeagueStandingsTable leagueSeason={selectedSeason} poolId={poolId} containerWidth={containerWidth}/>

          <MembershipsTable
            containerWidth={containerWidth}
            memberships={memberships}
            setMemberships={setMemberships}
            poolId={poolId}
            fetchPoolMemberships={fetchPoolMemberships}
            isCurrentUserCommissioner={isCurrentUserCommissioner}
          />

          <InviteUsersButton poolId={poolId} inviteToken={inviteToken} />

          {/* <PreviousBattles battles={battles} /> */}
          <Txt style={s.titleText}>Settings</Txt>
          <Txt>Need to be able to go to the create/edit league screen</Txt>
          <Txt>
            Need to be able to change league name or change league start date. Maybe just make it editable right here?
          </Txt>
          <LeaveLeagueButton
            poolId={poolId}
            memberships={memberships}
            currentUserId={currentUserId}
          />
        </ScrollView>

        <PoolSelectionModal
          modalVisible={modalVisible}
          userPools={userPools}
          setModalVisible={setModalVisible}
          currentPoolId={poolId}
        />
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
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
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
  bottomSheetTxt: {
    color: "#061826",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 9,
    // padding: 20,
    width: "80%",
  },
});
