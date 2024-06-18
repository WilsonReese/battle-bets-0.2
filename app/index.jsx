import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  return (
    <>
      <View style={s.container}>
				<StatusBar style="dark" />
        <Text>App</Text>
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
