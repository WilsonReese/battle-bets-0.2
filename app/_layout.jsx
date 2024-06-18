import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerShown: true,
        headerStyle: {
            backgroundColor: "green"
        }
        
      }} />
    </Stack>
  );
}