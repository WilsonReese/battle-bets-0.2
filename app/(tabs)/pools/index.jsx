import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Txt } from "../../../components/general/Txt";
import { StatusBar } from "expo-status-bar";

export default function Pools() {
  return (
    <View style={s.container}>
      <StatusBar style="dark"/>
      <Text>Pools Screen</Text>
      <Button title="Go to Pool 1" onPress={() => router.push("/pools/1")} />
      <Button
        title="Go to Pool 2"
        onPress={() =>
          router.push({
            pathname: "/pools/[id]",
            params: { id: 2 },
          })
        }
      />
      <Button
        title="Create a New Pool"
        onPress={() => router.push("/pools/create")}
      />
      <Txt>Test</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
});
