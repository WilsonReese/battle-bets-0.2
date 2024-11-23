import React, { useContext, useEffect, useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Txt } from "../../../components/general/Txt";
import { StatusBar } from "expo-status-bar";
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
import { useAxiosWithAuth } from "../../../utils/axiosConfig"; // Use Axios with Auth
import { Message } from "../../../components/general/Message";
import { Btn } from "../../../components/general/Buttons/Btn";

export default function Pools() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = useAxiosWithAuth(); // Use the custom Axios instance
  const { successMessage } = useLocalSearchParams(); // Retrieve the message parameter
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Display the success message if it exists
    if (successMessage) {
      setMessage({ text: successMessage, color: "#0C9449" });
    }
  }, [successMessage]);

  // Fetch pools from the backend API
  useEffect(() => {
    const fetchPools = async () => {
      try {
        const response = await api.get("/pools");
        setPools(response.data);
        setLoading(false);
      } catch (error) {
        // console.log("Header from fetching pools:", api.defaults.headers.Authorization);
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
        {message && (
          <Message
            message={message.text}
            color={message.color}
            onHide={() => setMessage(null)} // Clear the message after display
          />
        )}
        <LoadingIndicator color="dark" contentToLoad="pools" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      {message && (
        <Message
          message={message.text}
          color={message.color}
          location={0}
          onHide={() => setMessage(null)} // Clear the message after display
        />
      )}
      <StatusBar style="light" />

      <View style={s.titleContainer}>
        <Txt style={s.titleText}>Pools</Txt>
      </View>
      <View style={s.poolsContainer}>
        {pools.map((pool) => (
          <View style={s.btnContainer} key={pool.id}>
            <Btn
              btnText={`Go to ${pool.name}`}
              style={s.btn}
              isEnabled={true}
              onPress={() => router.push(`/pools/${pool.id}/`)}
            />
          </View>
        ))}
      </View>
      {/* <Button
        title="Create a New Pool"
        onPress={() => router.push("/pools/create")}
      /> */}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    // justifyContent: "center",
    // alignItems: "center",
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
    paddingVertical: 4,
    paddingHorizontal: 12,
    // margin: 4,
  },
});
