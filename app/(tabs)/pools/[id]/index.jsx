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

  const handleMakeBets = async (battleId, poolId) => {
    try {
      const response = await api.post(
        `/pools/${poolId}/battles/${battleId}/betslips`,
        {
          betslip: {
            name: null, // Name can be null or set to a default value
            status: "created",
          },
        }
      );

      // Get the created betslip's ID from the response
      const betslipId = response.data.id;

      // After betslip is created, navigate to the betslip or battle page
      router.push({
        pathname: `pools/${poolId}/battles/${latestBattle.id}/`,
        params: { betslipId }, // Pass the betslipId as a query parameter
      });
    } catch (error) {
      console.error("Error creating betslip:", error.response.data);
      Alert.alert("Error", "Failed to create betslip. Please try again.");
    }
  };

  // Render loading spinner while data is being fetched
  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={s.container}>
          <View style={s.container}>
            <LoadingIndicator color="dark" contentToLoad="battles" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <StatusBar style="dark" />
        <Txt style={{ color: "black", fontSize: 24 }}>
          Pool {poolId} - All Battles
        </Txt>
        <View style={s.currentBattleContainer}>
          <Txt style={s.txt}>Current Battle</Txt>
          <Txt style={s.txt}># Players</Txt>

          {/* Betslip has not been created */}
          {!userBetslip && (
            <Btn
            btnText={"Make Bets"}
            style={s.btn}
            isEnabled={true}
            onPress={() => handleMakeBets(latestBattle.id, poolId)}
          />
          )}

          {/* Betslip has been created but not submitted */}
          {userBetslip && userBetslip.status == "created" && (
            <View>
              <Txt style={s.txt}>
                Edit button with indication that betslip not submitted
              </Txt>
              <Btn
                btnText={"Edit Bets"}
                style={s.btn}
                isEnabled={true}
                onPress={() =>
                  router.push(
                    `/pools/${poolId}/battles/${latestBattle.id}/?betslipId=${userBetslip.id}`
                  )
                }
              />
            </View>
          )}

          {/* Betslip is submitted */}
          {userBetslip && userBetslip.status == "submitted" && (
            <Leaderboard
              userBetslip={userBetslip}
              poolId={poolId}
              battle={latestBattle}
            />
          )}

          {/* <View style={s.btnContainer}>
            {userBetslip ? (
              // Show "Edit Bets" button if betslip exists
              <Btn
                btnText={"Edit Bets"}
                style={s.btn}
                isEnabled={true}
                onPress={() =>
                  router.push(
                    `/pools/${poolId}/battles/${latestBattle.id}/?betslipId=${userBetslip.id}`
                  )
                }
              />
            ) : (
              // Show "Make Bets" button if no betslip exists
              <Btn
                btnText={"Make Bets"}
                style={s.btn}
                isEnabled={true}
                onPress={() => handleMakeBets(latestBattle.id, poolId)}
              />
            )}
          </View> */}
        </View>
        <Txt style={s.txt}>List of all battles</Txt>
        {battles.map((battle) => (
          <Txt key={battle.id} style={s.txt}>
            {battle.id}
          </Txt>
        ))}
        <Txt style={{ color: "black" }}>
          This screen will show the details of the pool - current battle,
          previous battles, number of users, leaderboards
        </Txt>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    margin: 8,
    // backgroundColor: "#f8f8f8",
  },
  currentBattleContainer: {
    // flex: 1,
    // alignItems: "center",
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#3A454D",
    borderRadius: 8,
    padding: 8,
    // backgroundColor: "#f8f8f8",
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
    color: "#061826",
    fontSize: 16,
  },
});
