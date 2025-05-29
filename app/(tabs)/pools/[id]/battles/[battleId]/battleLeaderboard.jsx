import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Txt } from '../../../../../../components/general/Txt';
import { useBattleLeaderboard } from '../../../../../../hooks/useBattleLeaderboard';

export default function BattleLeaderboard() {
  const { id: poolId, battleId, leagueSeasonId } = useLocalSearchParams();

  const { betslips } = useBattleLeaderboard(poolId, leagueSeasonId, battleId);

  console.log('Betslips on Leaderboard: ', betslips)
  console.log("Params:", useLocalSearchParams());
  
  return (
    <View style={s.container}>
      <Txt>Battle Leaderboard for Pool(?) {poolId}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#061826',
  },
  txt: {

  }, 
});