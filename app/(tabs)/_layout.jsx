import { Tabs } from "expo-router";
import {
  useFonts,
  Saira_100Thin,
  Saira_200ExtraLight,
  Saira_300Light,
  Saira_400Regular,
  Saira_500Medium,
  Saira_600SemiBold,
  Saira_700Bold,
  Saira_800ExtraBold,
  Saira_900Black,
} from "@expo-google-fonts/saira";
import { StyleSheet, View } from "react-native";
// import AppLoading from 'expo-app-loading';

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Saira_100Thin,
    Saira_200ExtraLight,
    Saira_300Light,
    Saira_400Regular,
    Saira_500Medium,
    Saira_600SemiBold,
    Saira_700Bold,
    Saira_800ExtraBold,
    Saira_900Black,
  });

  return (
    <View style={s.container}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "black", // Change the background color of the tab bar
            borderTopColor: "transparent", // Remove the top border
            // height: 90
          },
          tabBarLabelStyle: {
            fontFamily: "Saira_400Regular",
            fontSize: 14, // Adjust the font size of the tab labels
          },
          tabBarActiveBackgroundColor: "gray",
          tabBarActiveTintColor: "cyan", // Change the color of the active tab icon
          tabBarInactiveTintColor: "gray", // Change the color of the inactive tab icons
        }}
      >
        <Tabs.Screen
          name="pools"
          options={{ title: "Pools", headerShown: false }}
        />
        <Tabs.Screen name="scoreboard" options={{ title: "Scoreboard" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
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
