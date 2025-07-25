import { Stack } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { HeaderBackNavigation } from "../../../../../components/navigation/headerBackNavigation";
import { BetProvider } from "../../../../../components/contexts/BetContext";

export default function BattlesLayout() {
	return (
		<BetProvider>
			<View style={s.container}>
				<Stack
					screenOptions={{
						headerShown: false,
						headerStyle: {
							backgroundColor: "#061826", // Set custom background color
						},
						headerTitleAlign: "center", // Center the title or logo
						headerTitle: () => (
							<Image
								source={require("@/assets/images/white_logo.png")} // Path to your logo
								style={{ width: 140, height: 40 }}
								resizeMode="contain"
							/>
						),
						headerTintColor: "#F8F8F8", // Text color
						headerShadowVisible: false, // Hide header border
						headerBackButtonMenuEnabled: false,
						// headerLeft: () => <HeaderBackNavigation />,
						contentStyle: { backgroundColor: "transparent" },
						gestureEnabled: true, // 👈 This enables swipe-to-go-back
					}}
				>
					{/* List of battles for the pool */}
					<Stack.Screen
						name="index"
						options={{ title: "Battle List", headerShown: false }}
					/>

					{/* Dynamic battle details ||| Below changes the Battle Details Page */}
					<Stack.Screen
						name="[battleId]/index"
						options={{
							title: "Battles",
							headerShown: true,
							headerLeft: () => <HeaderBackNavigation />,
							// headerBackTitleVisible: true,
							// headerBackTitle: "Back",
							headerBackTitleStyle: {
								color: "blue",
								fontFamily: "Saira_400Regular",
							},
						}}
					/>
					<Stack.Screen
						name="[battleId]/battleLeaderboard"
						options={{
							title: "Battle Leaderboard",
							headerShown: true,
							headerLeft: () => <HeaderBackNavigation />,
							// headerBackTitleVisible: true,
							// headerBackTitle: "Back",
							headerBackTitleStyle: {
								color: "blue",
								fontFamily: "Saira_400Regular",
							},
						}}
					/>
				</Stack>
			</View>
		</BetProvider>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
	},
});
