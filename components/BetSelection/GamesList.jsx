// components/BattleDetails/GamesList.jsx
import React, { useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { GameCard } from "@/components/GameCard/GameCard.jsx";
import { BetSelectionCard } from "../GameCard/BetSelectionCard";

function _GamesList({ games }) {
	// renderGameCard never changes identity
	const renderGameCard = useCallback(
		({ item }) => (
			<View style={s.wrapper}>
				<BetSelectionCard game={item} type="betSelection" />
			</View>
		),
		[]
	);

	return (
		<FlatList
			data={games}
			keyExtractor={(g) => g.id.toString()}
			renderItem={renderGameCard}
			initialNumToRender={10}
      showsVerticalScrollIndicator={false}
			windowSize={5}
			removeClippedSubviews
			contentContainerStyle={s.container}
			getItemLayout={(_, index) => ({
				length: 100, // if your card is a fixed height, say 100
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
