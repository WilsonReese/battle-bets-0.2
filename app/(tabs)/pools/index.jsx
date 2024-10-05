import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Button,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import axios from "axios"; // Import axios
import { Txt } from "../../../components/general/Txt";
import { StatusBar } from "expo-status-bar";
import { API_BASE_URL } from "../../../utils/api";
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
import { useAxiosWithAuth } from "../../../utils/axiosConfig"; // Use Axios with Auth

export default function Pools() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useAxiosWithAuth(); // Use the custom Axios instance

  // Fetch pools from the backend API
  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await api.get("/pools");
        setPools(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pools:", error);
        setLoading(false);
      }
    };

    fetchPools();
  }, [api]);

  // Render loading state or pool list
  if (loading) {
    return (
      <View style={s.container}>
        <LoadingIndicator color="dark" contentToLoad="pools" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar style="dark" />
      <Txt style={{ color: "black" }}>Pools Screen</Txt>
      {pools.map((pool) => (
        <Button
          key={pool.id}
          title={`Go to ${pool.name}`}
          onPress={() => router.push(`/pools/${pool.id}/`)}
        />
      ))}
      <Button
        title="Create a New Pool"
        onPress={() => router.push("/pools/create")}
      />
      <Txt style={{ color: "black" }}>Test</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f8f8f8",
  },
});