// components/BattleDetails/GamesList.jsx
import React, { useCallback, useRef } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { GameCard } from "@/components/GameCard/GameCard.jsx";
import { BetSelectionCard } from "../GameCard/BetSelectionCard";

function _GamesList({ games }) {
	// ref to store { [index]: height }
	const heights = useRef({});
	
	// when a card mounts or changes size, record its height
	const onCardLayout = useCallback(
    (index) => (e) => {
      const h = e.nativeEvent.layout.height;
      heights.current[index] = h;
    },
    []
  );


  // render each card, wrapping with onLayout
  const renderGameCard = useCallback(
    ({ item, index }) => (
      <View
        style={s.wrapper}
        onLayout={onCardLayout(index)}
      >
        <BetSelectionCard game={item} />
      </View>
    ),
    [onCardLayout]
  );

	// build getItemLayout from those measurements
  const getItemLayout = useCallback(
    (_data, index) => {
      const length = heights.current[index] ?? 200;  // fallback estimate
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += heights.current[i] ?? 200;
      }
      return { length, offset, index };
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
			getItemLayout={getItemLayout}
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
