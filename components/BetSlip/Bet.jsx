// import React, { useEffect, useRef, useState } from "react";
// import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";
// import { Txt } from "../general/Txt";
// import { BetSelector } from "../GameCard/BetSelector";
// import { BETTING_RULES } from "../../utils/betting-rules";
// import { useBetOps, useBets } from "../contexts/BetContext";
// import { BetDetails } from "./BetDetails";
// import { format } from "date-fns";
// import { BetAmount } from "./BetAmount";

// export const Bet = React.memo(_Bet);

// function _Bet({ betOptionId, backgroundColor }) {
// 	// const { minBet, maxBet } = BETTING_RULES[bet.betType];
// 	// const { openBetSelectorIds } = useBets();
// 	// const { removeBet, toggleBetSelector } = useBetOps();

// 	// const isBetSelectorOpen = openBetSelectorIds.has(bet.id);
// 	// const animatedHeight = useRef(new Animated.Value(0)).current;

// 	const bet = useBetStore((state) =>
// 		state.bets.find((b) => b.bet_option_id === betOptionId)
// 	);
// 	if (!bet) return null;

// 	const matchup = `${bet.game.away_team.name} at ${bet.game.home_team.name}`;
// 	const gameTime = format(new Date(bet.game.start_time), "h:mm a"); // Format time

// 	// useEffect(() => {
// 	//   Animated.timing(animatedHeight, {
// 	//     toValue: isBetSelectorOpen ? 54 : 0, // Adjust the height as needed
// 	//     duration: 200,
// 	//     useNativeDriver: false,
// 	//   }).start();
// 	// }, [isBetSelectorOpen]);

// 	return (
// 		<View style={[s.container]}>
// 			<TouchableOpacity
// 				style={[
// 					s.betItem,
// 					{ backgroundColor },
// 					// isBetSelectorOpen && s.betItemEditMode,
// 				]}
// 				// onPress={() => toggleBetSelector(bet.id)}
// 			>
// 				<View style={s.betDetailsContainer}>
// 					<View style={s.betNameContainer}>
// 						{/* <Txt style={s.betNameText}>{bet.name}</Txt> */}
// 						<BetDetails
// 							name={bet.title}
// 							multiplier={bet.payout}
// 							matchup={matchup}
// 							time={gameTime}
// 							betNameColor={"#F8F8F8"}
// 						/>
// 					</View>
// 					<View style={s.betAmountContainer}>
// 						<BetAmount
// 							bet_amount={bet.bet_amount}
// 							to_win_amount={bet.to_win_amount}
// 						/>
// 					</View>
// 				</View>
// 			</TouchableOpacity>
// 			{/* <Animated.View
//         style={[
//           s.betSelectorContainer,
//           {
//             height: animatedHeight,
//             overflow: "hidden",
//             opacity: animatedHeight.interpolate({
//               inputRange: [0, 54],
//               outputRange: [0, 1],
//             }),
//           },
//         ]}
//       >
//         <BetSelector
//           betId={bet.id}
//           closeSelection={() => {
//             removeBet(bet.id);
//           }}
//           minBet={minBet}
//           maxBet={maxBet}
//           payout={bet.toWinAmount / bet.betAmount}
//         />
//       </Animated.View> */}
// 		</View>
// 	);
// }

// const s = StyleSheet.create({
// 	container: {
// 		paddingHorizontal: 8,
// 		// borderBottomWidth: .5,
// 		borderColor: "#0F2638",
// 		paddingVertical: 4,
// 	},
// 	betItem: {
// 		justifyContent: "space-between",
// 		paddingHorizontal: 8,
// 		paddingVertical: 2,
// 		// borderWidth: .5,
// 		borderRadius: 8,
// 	},
// 	betItemEditMode: {
// 		borderTopLeftRadius: 8,
// 		borderTopRightRadius: 8,
// 		// backgroundColor: "#54D18C",
// 		// borderWidth: .5,
// 		// borderColor: '#54D18C'
// 	},
// 	betDetailsContainer: {
// 		flexDirection: "row",
// 		alignItems: "center",
// 		// backgroundColor: 'orange'
// 		// justifyContent: "space-between",
// 	},
// 	betNameContainer: {
// 		flex: 3,
// 		// paddingRight: 20,
// 		// marginRight: 20,
// 		// backgroundColor: 'green'
// 	},
// 	betAmountContainer: {
// 		flex: 2,
// 		alignItems: "flex-end",
// 		// backgroundColor: 'blue'
// 	},
// 	betSelectorContainer: {
// 		marginBottom: 4,
// 	},
// });

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
							removeBet(bet.bet_option_id);
							setIsOpen(false);
						}}
						minBet={minBet}
						maxBet={maxBet}
						payout={bet.payout}
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
		marginBottom: 4,
	},
});
