import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Pools",
          headerStyle: {
            backgroundColor: "green",
          },
        }}
      />
      <Tabs.Screen
        name="pools/[id]"
        options={{
          headerShown: true,
          title: "Picks",
          headerStyle: {
            backgroundColor: "green",
          },
        }}
      />
    </Tabs>
  );
}
