import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Txt } from "../../../../components/general/Txt.jsx";
import { StatusBar } from "expo-status-bar";
import { Btn } from "../../../../components/general/Buttons/Btn.jsx";
import { SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE_URL } from "../../../../utils/api.js";
import { LoadingIndicator } from "../../../../components/general/LoadingIndicator.jsx";

export default function PoolDetails() {
  const { id: poolId } = useLocalSearchParams();
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestBattleId, setLatestBattleId] = useState(null);

  // Function to fetch battles and determine the latest one
  const fetchBattles = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/pools/${poolId}/battles`
      );
      const fetchedBattles = response.data;

      setBattles(fetchedBattles);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching battles:", error);
      setLoading(false); // Stop loading if there's an error
      Alert.alert("Error", "Failed to fetch battles.");
    }
  };

  // useEffect to fetch battles when the component mounts
  useEffect(() => {
    fetchBattles();
  }, []);

  const latestBattle = battles[0];

  // const handleMakeBets = () => {
  //   if (latestBattle) {
  //     router.push(`pools/${poolId}/battles/${latestBattle.id}/`);
  //   } else {
  //     Alert.alert("No battles", "There is no upcoming battle to make bets on.");
  //   }
  // };

  const handleMakeBets = async (battleId, poolId) => {
    try {
      // Creating a betslip for the current user (user_id = 1) and the selected battle
      const response = await axios.post(`${API_BASE_URL}/pools/${poolId}/battles/${battleId}/betslips`, {
        battle_id: battleId,
        user_id: 1,    // Hardcoding user ID to 1 for now
        name: null,    // Setting name to null
      });
  
      // Get the created betslip's ID from the response
      const betslipId = response.data.id;
  
      // After betslip is created, navigate to the betslip or battle page
      router.push({
        pathname: `pools/${poolId}/battles/${latestBattle.id}/`,
        params: { betslipId },  // Pass the betslipId as a query parameter
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
        <Txt style={s.txt}>List of all battles</Txt>
        {battles.map((battle) => (
          <Txt key={battle.id} style={s.txt}>
            {battle.id}
          </Txt>
        ))}
        <View style={s.currentBattleContainer}>
          <Txt style={s.txt}>Current Battle</Txt>
          <Txt style={s.txt}># Players</Txt>
          <View style={s.btnContainer}>
            <Btn
              btnText={"Make Bets"}
              style={s.btn}
              isEnabled={true}
              onPress={() => handleMakeBets(latestBattle.id, poolId)} // Pass battleId and poolId to the function
            />
            <Btn
              btnText={"Edit Bets"}
              style={s.btn}
              isEnabled={false}
              onPress={() => router.push(`/pools/${id}/battles/4/`)}
            />
          </View>
        </View>
        <Txt style={{ color: "black" }}>
          This screen will show the details of the pool - current battle,
          previous battles, number of users, leaderboards
        </Txt>
        {/* <Button title="Make Picks for Battle 1" onPress={() => router.push(`/pools/${id}/battles/1/`)} /> */}
        {/* <Button
        title="Make Picks for Battle 2"
        onPress={() =>
          router.push({
            pathname: `/pools/${id}/battles/[battleId]`,
            params: { battleId: 2 },
          })
        }
      />
      <Button
        title="Create a New Battle"
        onPress={() => router.push("/battles/create")}
      />
      <Txt style={{color: 'black'}}>Test</Txt> */}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    margin: 8,
    // backgroundColor: "#f8f8f8",
  },
  currentBattleContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#3A454D",
    borderRadius: 8,
    padding: 8,
    // backgroundColor: "#f8f8f8",
  },
  btnContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    margin: 4,
  },
  txt: {
    // fontFamily: "Saira_300Light",
    color: "#061826",
    fontSize: 16,
  },
});
