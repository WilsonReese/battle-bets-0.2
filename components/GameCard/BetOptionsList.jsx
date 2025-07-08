import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { PaginatedFlatList } from "../general/PaginatedFlatList";
import { Spread } from "./Spread/Spread";
import { OverUnder } from "./OverUnder/OverUnder";
import { MoneyLine } from "./MoneyLine";
import { PropBets } from "./PropBets";
import { useState } from "react";

// I will eventually want to change this so that the enum for bet type
// passes only what we need
export function BetOptionsList({ game, containerWidth }) {
	const [cardWidth, setCardWidth] = useState(null);

	if (!game?.bet_options?.length) return null;

	// Organize bet options by category
	const spreadOptions = game.bet_options.filter((b) => b.category === "spread");
	const ouOptions = game.bet_options.filter((b) => b.category === "ou");
	const moneyLineOptions = game.bet_options.filter(
		(b) => b.category === "money_line"
	);
	const propBetOptions = game.bet_options.filter((b) => b.category === "prop");

	const homeTeam = game.home_team.name;
	const awayTeam = game.away_team.name;

	const pages = [
		() => (
			<View>
				<Spread
					spreadOptions={spreadOptions}
					game={game}
					homeTeam={homeTeam}
					awayTeam={awayTeam}
				/>
				<OverUnder
					ouOptions={ouOptions}
					game={game}
					homeTeam={homeTeam}
					awayTeam={awayTeam}
				/>
				<MoneyLine
					moneyLineOptions={moneyLineOptions}
					game={game}
					homeTeam={homeTeam}
					awayTeam={awayTeam}
				/>
			</View>
		),
		() => (
			<PropBets
				betOptions={propBetOptions}
				game={game}
				homeTeam={homeTeam}
				awayTeam={awayTeam}
			/>
		),
	];

return (
  <View
    style={s.container}
    onLayout={(e) => {
      const width = e.nativeEvent.layout.width;
      if (width !== cardWidth) setCardWidth(width);
    }}
  >
    {(cardWidth === null || cardWidth === 0) && (
      <ActivityIndicator/>
    )}
    {cardWidth !== null && cardWidth > 0 && (
      <PaginatedFlatList
        data={pages}
        itemsPerPage={1}
        renderItemRow={(renderPage) => renderPage()}
        containerWidth={cardWidth}
        isComponentPages={true}
      />
    )}
  </View>
);
}

const s = StyleSheet.create({
	container: {
		marginTop: 4,
	},
});
