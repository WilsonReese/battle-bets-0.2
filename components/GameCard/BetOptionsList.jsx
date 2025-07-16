import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from "react-native";
import { Txt } from "../general/Txt";
import { PaginatedFlatList } from "../general/PaginatedFlatList";
import { Spread } from "./Spread/Spread";
import { OverUnder } from "./OverUnder/OverUnder";
import { MoneyLine } from "./MoneyLine";
import { PropBets } from "./PropBets/PropBets";
import { useState } from "react";

// I will eventually want to change this so that the enum for bet type
// passes only what we need
export function BetOptionsList({ game }) {
	// const [cardWidth, setCardWidth] = useState(null);
	const { width: windowWidth } = useWindowDimensions();

  // console.log("🔄 Bet Options List rendered for game", game.id);

	if (!game?.bet_options?.length) return null;
	const cardWidth = windowWidth - 32; // this is the total horizontal padding/margin on the side of the flatlist

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
		{
			key: "main",
			component: (
				<View>
					<Spread
						spreadOptions={spreadOptions}
						game={game}
					/>
					<OverUnder
						ouOptions={ouOptions}
						game={game}
					/>
					<MoneyLine
						moneyLineOptions={moneyLineOptions}
						game={game}
					/>
				</View>
			),
		},
		{
			key: "props",
			component: (
				<PropBets
					betOptions={propBetOptions}
					game={game}
					homeTeam={homeTeam}
					awayTeam={awayTeam}
				/>
			),
		},
	];

	return (
    <View style={s.container}>
      <PaginatedFlatList
        data={pages}
        itemsPerPage={1}
        keyExtractor={(item) => item.key}
        renderItemRow={(item) => item.component}
        containerWidth={cardWidth}
        isComponentPages={true}
      />
    </View>
	);
}

const s = StyleSheet.create({
	container: {
		marginTop: 4,
	},
});
