import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Matchup } from './Matchup/Matchup';
import { BetOptions } from './BetOptions';
// import { Matchup } from './Matchup';
// import { BetOptions } from './BetOptions';

function _BetSelectionCard({ game }) {
  return (
    <View style={s.card}>
      <View style={{ height: 4 }} />
      <Matchup
        homeTeam={game.home_team.name}
        awayTeam={game.away_team.name}
      />
      <BetOptions game={game} />
    </View>
  );
}

export const BetSelectionCard = React.memo(_BetSelectionCard);

const s = StyleSheet.create({
	card: {
		backgroundColor: "#0F2638",
		marginVertical: 4,
		borderRadius: 8,
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	gameDetails: {
		flexDirection: "row",
		justifyContent: "flex",
	},
});