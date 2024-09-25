import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Txt } from "../../../../components/general/Txt.jsx";
import { StatusBar } from "expo-status-bar";
import { Btn } from "../../../../components/general/Buttons/Btn.jsx";
import { SafeAreaProvider } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE_URL } from "../../../../utils/api.js";

export default function PoolDetails() {
  const { id: poolId } = useLocalSearchParams();
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch battles when the component mounts
  useEffect(() => {
    const fetchBattles = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/pools/${poolId}/battles`
        );
        setBattles(response.data); // Store battle data in state
        setLoading(false); // Stop loading spinner
      } catch (error) {
        console.error("Error fetching battles:", error);
        setLoading(false); // Stop loading spinner even in case of error
      }
    };

    fetchBattles(); // Call the function to fetch battles
  }, [poolId]);

  // Render loading spinner while data is being fetched
  if (loading) {
    return (
      <View style={s.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Txt style={{ color: "black" }}>Loading battles...</Txt>
      </View>
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
          <Txt key={battle.id} style={s.txt}>{battle.id}</Txt>
        ))}
        <View style={s.currentBattleContainer}>
          <Txt style={s.txt}>Current Battle</Txt>
          <Txt style={s.txt}># Players</Txt>
          <View style={s.btnContainer}>
            <Btn
              btnText={"Make Bets"}
              style={s.btn}
              isEnabled={true}
              onPress={() => router.push(`/pools/${poolId}/battles/10/`)}
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
