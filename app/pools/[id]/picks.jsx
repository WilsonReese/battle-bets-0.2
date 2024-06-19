import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Picks() {
  const { id } = useLocalSearchParams();
  
  return (
    <View style={styles.container}>
      <Text>Picks Screen for {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
});