import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

// import { Tabs } from "expo-router";

// export default function TabsLayout() {
//   return (
//     <Tabs>
//       <Tabs.Screen
//         name="index"
//         options={{
//           headerShown: true,
//           title: "Pools",
//           headerStyle: {
//             backgroundColor: "green",
//           },
//         }}
//       />
//       <Tabs.Screen
//         name="pools/[id]"
//         options={{
//           headerShown: true,
//           title: "Picks",
//           headerStyle: {
//             backgroundColor: "green",
//           },
//         }}
//       />
//     </Tabs>
//   );
// }

