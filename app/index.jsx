import { StyleSheet, Text, View } from "react-native";

export default function Home() {
  return (
    <>
      <View style={s.container}>
        <Text>App</Text>
      </View>
    </>
  );
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		padding: 8,
	},
});
