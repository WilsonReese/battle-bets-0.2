import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link, router } from "expo-router";

export default function Home() {
  return (
    <>
      <View style={s.container}>
        <StatusBar style="dark" />
        <Text>Pool 1 Name</Text>
        <Link href="/pools/1">Go to Pool 1</Link>
        <Text>Pool 2 Name</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/pools/[id]",
              params: { id: 2 },
            })
          }
        >
          <Text>Go to Pool 2</Text>
        </TouchableOpacity>
        <Text>Create a pool</Text>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: "blue",
  },
});
