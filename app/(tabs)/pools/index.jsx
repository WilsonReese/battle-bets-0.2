import React, { useCallback, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Txt } from "../../../components/general/Txt";
import { StatusBar } from "expo-status-bar";
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
import { useAxiosWithAuth } from "../../../utils/axiosConfig"; // Use Axios with Auth
import { Btn } from "../../../components/general/Buttons/Btn";
import { PoolCard } from "../../../components/PoolCard/PoolCard";
import { NoLeagues } from "../../../components/PoolCard/NoLeagues";

export default function Pools() {
  const [pools, setPools] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(true);
  const api = useAxiosWithAuth(); // Use the custom Axios instance

  // Fetch pools from the backend API
  useFocusEffect(
    useCallback(() => {
      const fetchPools = async () => {
        setIsScreenLoading(true);
        try {
          const response = await api.get("/pools");
          setPools(response.data);
          setIsScreenLoading(false);
        } catch (error) {
          console.error("Error fetching pools:", error);
          setIsScreenLoading(false);
        }
      };

      fetchPools();
    }, [api])
  );

  // Render loading state or pool list
  if (isScreenLoading) {
    return (
      <View style={s.container}>
        <LoadingIndicator color="light" contentToLoad="pools" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar style="light" />
      
      <View style={s.titleContainer}>
        <Txt style={s.titleText}>Leagues</Txt>
      </View>

      {pools.length === 0 ? (
        <NoLeagues />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {pools.map((pool) => (
            <PoolCard key={pool.id} pool={pool} />
          ))}
        </ScrollView>
      )}

      <View style={s.createLeagueContainer}>
        <Btn
          btnText="Create a League"
          style={s.btn}
          isEnabled={true}
          onPress={() => router.push(`/pools/create/`)}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "#061826",
  },
  titleContainer: {},
  titleText: {
    color: "#F8F8F8",
    fontSize: 24,
  },
  poolsContainer: {},
  btnContainer: {
    paddingTop: 8,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  createLeagueContainer: {
    paddingVertical: 12,
  },
});
