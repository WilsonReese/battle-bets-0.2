import { View, Text, Button, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function PoolDetails() {
  const { id } = useLocalSearchParams();

  return (
    <View style={s.container}>
      <Text>Pool Details Screen - Pool ID: {id}</Text>
      <Button title="View Standings" onPress={() => router.push(`/pools/${id}/standings`)} />
      <Button title="View Picks" onPress={() => router.push(`/pools/${id}/picks`)} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
});