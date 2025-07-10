// components/BattleDetails/GamesList.jsx
import React, { useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { GameCard } from "@/components/GameCard/GameCard.jsx";
import { BetSelectionCard } from "../GameCard/BetSelectionCard";

function _GamesList({ games }) {
	// renderGameCard never changes identity
	console.log('GamesList Bets')
const renderGameCard = useCallback(
  ({ item }) => {
    return (
      <View style={s.wrapper}>
        <BetSelectionCard game={item} />
      </View>
    );
  },
  []
);

	return (
		<FlatList
			data={games}
			keyExtractor={(g) => g.id.toString()}
			renderItem={renderGameCard}
			initialNumToRender={5}
      showsVerticalScrollIndicator={false}
			windowSize={10}
			removeClippedSubviews
			contentContainerStyle={s.container}
			getItemLayout={(_, index) => ({
				length: 100, // if your card is a fixed height, say 100
				// left off here - change this to ITEM HEIGHT AND GET HEIGHT VALUES THAT I NEED, NEEDS TO BE DONE AFTER OTHER BET CATEGORIES
				offset: 100 * index,
				index,
			})}
		/>
	);
}

export const GamesList = React.memo(_GamesList);

const s = StyleSheet.create({
	container: { 
    // padding: 4, 
    paddingBottom: 108 
  },
	wrapper: { 
    marginBottom: 4 
  },
});
