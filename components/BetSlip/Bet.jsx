import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
import { Txt } from "../general/Txt";
import { BetDetails } from "./BetDetails";
import { BetAmount } from "./BetAmount";
import { format } from "date-fns";
import { useBetStore } from "../../state/useBetStore";
import { BETTING_RULES } from "../../utils/betting-rules";
import { BetSelector } from "../GameCard/BetSelector";

export const Bet = React.memo(
	function Bet({ betOptionId }) {
		// subscribe to only this bet’s slice
		const bet = useBetStore((state) =>
			state.bets.find((b) => b.bet_option_id === betOptionId)
		);
		if (!bet) return null;

		const [isOpen, setIsOpen] = useState(false);
		const animatedHeight = useRef(new Animated.Value(0)).current;
		const removeBet = useBetStore((state) => state.removeBet);
		const resetVer = useBetStore((s) => s.selectorsResetVersion);

		const matchup = `${bet.game.away_team.name} at ${bet.game.home_team.name}`;
		const gameTime = format(new Date(bet.game.start_time), "h:mm a");

		const { minBet, maxBet } = BETTING_RULES[bet.category];

		useEffect(() => {
			Animated.timing(animatedHeight, {
				toValue: isOpen ? 54 : 0,
				duration: 100,
				useNativeDriver: false,
			}).start();
		}, [isOpen]);

		// resets 
		useEffect(() => {
			setIsOpen(false);
		}, [resetVer]);

		return (
			<View style={[s.container]}>
				<TouchableOpacity
					style={[s.betItem, isOpen && s.betItemEditMode]}
					onPress={() => setIsOpen(!isOpen)}
				>
					<View style={s.betDetailsContainer}>
						<View style={s.betNameContainer}>
							{/* <Txt style={s.betNameText}>{bet.name}</Txt> */}
							<BetDetails
								name={bet.title}
								multiplier={bet.payout}
								matchup={matchup}
								time={gameTime}
								betNameColor={"#F8F8F8"}
							/>
						</View>
						<View style={s.betAmountContainer}>
							<BetAmount
								bet_amount={bet.bet_amount}
								to_win_amount={bet.to_win_amount}
							/>
						</View>
					</View>
				</TouchableOpacity>

				<Animated.View
					style={[
						s.betSelectorContainer,
						{
							height: animatedHeight,
							opacity: animatedHeight.interpolate({
								inputRange: [0, 54],
								outputRange: [0, 1],
							}),
							overflow: "hidden",
						},
					]}
				>
					<BetSelector
						bet={bet}
						closeSelection={() => {
							useBetStore.getState().removeBet(bet.bet_option_id);
							setIsOpen(false);
						}}
						minBet={minBet}
						maxBet={maxBet}
						payout={bet.payout}
						betOptionId={bet.bet_option_id}
					/>
				</Animated.View>
			</View>
		);
	},
	// only re-render if the *props* change
	(prev, next) =>
		prev.betOptionId === next.betOptionId &&
		prev.backgroundColor === next.backgroundColor
);

const s = StyleSheet.create({
	container: {
		paddingHorizontal: 8,
		// borderBottomWidth: .5,
		// borderColor: "#0F2638",
		// paddingVertical: 4,
	},
	betItem: {
		justifyContent: "space-between",
		paddingHorizontal: 8,
		paddingVertical: 4,
		// borderWidth: .5,
		backgroundColor: "#0F2638",
		borderRadius: 8,
	},
	betItemEditMode: {
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		// backgroundColor: "#54D18C",
		// borderWidth: .5,
		// borderColor: '#54D18C'
	},
	betDetailsContainer: {
		flexDirection: "row",
		alignItems: "center",
		// backgroundColor: 'orange'
		// justifyContent: "space-between",
	},
	betNameContainer: {
		flex: 3,
		// paddingRight: 20,
		// marginRight: 20,
		// backgroundColor: 'green'
	},
	betAmountContainer: {
		flex: 2,
		alignItems: "flex-end",
		// backgroundColor: 'blue'
	},
	betSelectorContainer: {
		// marginBottom: 4,
	},
});
