import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Txt } from '../../../components/general/Txt';

export default function Scoreboard() {
  return (
    <View style={styles.container}>
      <Txt>Game</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
    padding: 16,
  },
});