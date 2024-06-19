import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs         screenOptions={{
      tabBarStyle: {
        backgroundColor: 'blue', // Change the background color of the tab bar
        borderTopColor: 'transparent', // Remove the top border
      },
      tabBarLabelStyle: {
        color: 'white', // Change the text color of the tab labels
        fontSize: 14, // Adjust the font size of the tab labels
      },
      tabBarActiveTintColor: 'red', // Change the color of the active tab icon
      tabBarInactiveTintColor: 'gray', // Change the color of the inactive tab icons
    }}>
      <Tabs.Screen name="pools" options={{ title: "Pools", headerShown: false }} />
      <Tabs.Screen name="scoreboard" options={{ title: "Scoreboard" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
