import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function TabLayout() {
	return (
		<View style={s.container}>
			<Tabs
				screenOptions={{
					headerShown: false, // no idea what it controls
					tabBarStyle: {
						backgroundColor: "#061826", // Change the background color of the tab bar
						borderTopColor: "transparent", // Remove the top border
						// height: 90
					},
					tabBarLabelStyle: {
						fontFamily: "Saira_400Regular",
						fontSize: 14, // Adjust the font size of the tab labels
					},
					// tabBarActiveBackgroundColor: "gray",
					tabBarActiveTintColor: "#54D18C", // Change the color of the active tab icon
					tabBarInactiveTintColor: "#C7CDD1", // Change the color of the inactive tab icons
				}}
			>
				<Tabs.Screen
					name="pools"
					options={{
						title: "Leagues",
						headerShown: false,

						tabBarIcon: ({ color }) => (
							<FontAwesome6 name="ranking-star" size={16} color={color} />
						),
					}} // changes Pools page and all children
				/>
				<Tabs.Screen
					name="scoreboard"
					options={{
						title: "Scoreboard",
						headerShown: false,
						unmountOnBlur: true,
						tabBarIcon: ({ color }) => (
							<MaterialCommunityIcons
								name="scoreboard"
								size={22}
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{ title: "Profile", headerShown: false, 
            						tabBarIcon: ({ color }) => (
							<FontAwesome6 name="user-large" size={14} color={color} />
						),
           }}
          
				/>
			</Tabs>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "green", // Your global background color
	},
});
