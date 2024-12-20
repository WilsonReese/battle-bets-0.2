import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Standings() {
  const { id } = useLocalSearchParams();
  
  return (
    <View style={s.container}>
      <Text>Standings Screen for Pool {id}</Text>
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