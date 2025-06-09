import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";


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
          tabBarInactiveTintColor: "#B8C3CC", // Change the color of the inactive tab icons
        }}
      >
        <Tabs.Screen
          name="pools"
          options={{ title: "Leagues", headerShown: false }} // changes Pools page and all children
        />
        <Tabs.Screen name="scoreboard" options={{ title: "Scoreboard", headerShown: false }} />
        <Tabs.Screen name="profile" options={{ title: "Profile", headerShown: false }} />
      </Tabs>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green', // Your global background color
  },
});
