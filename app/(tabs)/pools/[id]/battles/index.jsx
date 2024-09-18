import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Txt } from "../../../../../components/general/Txt.jsx";
import { StatusBar } from "expo-status-bar";

export default function Battles() {
  return (
    <View style={s.container}>
      <StatusBar style="dark"/>
      <Text>Battles Screen</Text>
      <Button title="Go to Battle 1" onPress={() => router.push(`/pools/${id}/battles/1/`)} />
      <Button
        title="Go to Battle 2"
        onPress={() =>
          router.push({
            pathname: "/battles/[id]",
            params: { id: 2 },
          })
        }
      />
      <Button
        title="Create a New Battle"
        onPress={() => router.push("/battles/create")}
      />
      <Txt style={{color: 'black'}}>Test</Txt>
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
