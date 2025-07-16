import React from "react";
import { View, StyleSheet } from "react-native";
import { BetTypeHeading } from "../BetTypeHeading";
import PropRow from "./PropRow";
import { Txt } from "../../general/Txt";
import { LinesUnavailable } from "../LinesUnavailable";

function _PropBets({ betOptions = [], game }) {
	if (betOptions.length === 0) {
		return (
			<>
				<BetTypeHeading heading={"Prop Bets"} />
				<LinesUnavailable/>
			</>
    )
	}

	return (
		<View>
			<BetTypeHeading heading="Prop Bets" />
			<View style={s.container}>
				{betOptions.map((opt) => (
					<PropRow key={opt.id} option={opt} game={game} />
				))}
			</View>
		</View>
	);
}

export const PropBets = React.memo(_PropBets);

const s = StyleSheet.create({
	container: {
    gap: 4
  }
  // any container‐level styles if you need
});
