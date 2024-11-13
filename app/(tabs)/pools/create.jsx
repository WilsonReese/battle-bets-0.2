import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CreatePool() {
  return (
    <View style={s.container}>
      <Text>Create Pool Screen</Text>
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