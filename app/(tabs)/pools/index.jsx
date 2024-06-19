import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Pools() {

  return (
    <View style={styles.container}>
      <Text>Pools Screen</Text>
      <Button title="Go to Pool 1" onPress={() => router.push('/pools/1')} />
      <Button title="Create a New Pool" onPress={() => router.push('/pools/create')} />
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