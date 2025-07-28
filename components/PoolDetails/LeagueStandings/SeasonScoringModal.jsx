import {
	Dimensions,
	Modal,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";

import { useMemo, useState } from "react";
import { router } from "expo-router";
import { Txt } from "../../general/Txt";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Btn } from "../../general/Buttons/Btn";
import {
	getPlayoffRules,
	getSeasonScoringRules,
} from "../../../utils/betting-rules";

export function SeasonScoringModal({
	infoModalVisible,
	setInfoModalVisible,
	leagueSize,
}) {
	const { height: screenHeight } = Dimensions.get("window");
	const maxModalHeight = screenHeight * 0.8;

	const rules = useMemo(() => getSeasonScoringRules(leagueSize), [leagueSize]);
	const { confirmed, playIn, advance, total } = getPlayoffRules(leagueSize);

	return (
		<>
			<Modal transparent={true} animationType="fade" visible={infoModalVisible}>
				<View style={s.overlay}>
					<TouchableWithoutFeedback onPress={() => setInfoModalVisible(false)}>
						<View style={StyleSheet.absoluteFill} />
					</TouchableWithoutFeedback>

					<View style={[s.container, { maxHeight: maxModalHeight }]}>
						<ScrollView style={{ padding: 16 }}>
							<Txt style={s.title}>League Rules</Txt>
							<View style={{ paddingTop: 16 }}>
								<Txt style={s.heading}>Battle Scoring</Txt>
								<Txt style={s.paragraph}>
									Points earned for each battle are based on league size and
									placement.
								</Txt>
								<View style={s.scoringContainer}>
									{rules.map(({ position, points }) => (
										<View key={position} style={s.scoringItem}>
											<Txt style={s.placement}>{position}</Txt>
											<Txt style={s.points}>{points}</Txt>
											<Txt style={{ fontSize: 12 }}>points</Txt>
										</View>
									))}
								</View>
							</View>
							<View style={{ paddingTop: 24 }}>
								<Txt style={s.heading}>Season Timeline</Txt>
								<Txt style={s.paragraph}>
									• The regular season runs through Week 14
								</Txt>
								<Txt style={s.paragraph}>
									• The Play-In Battle occurs during Conference Championship
									week
								</Txt>
								<Txt style={s.paragraph}>
									• Battle Bets Playoffs occur during the College Football
									Playoff
								</Txt>
							</View>
							
							<View style={{ paddingTop: 16 }}>
								<Txt style={s.heading}>Playoffs</Txt>
								<Txt style={[s.paragraph, { paddingBottom: 8 }]}>
									The number of members who make the playoffs and play-in
									depends on league size.
								</Txt>
								<View>
									<View style={[s.element, { alignSelf: "center" }]}>
										<Txt style={s.playoffTxt}>Total Playoff Spots</Txt>
										<Txt style={s.playoffNumber}>{total}</Txt>
									</View>

									<View style={s.rotatedIconRow}>
										<View style={[s.arrowIcon, {transform: [{ rotate: "45deg" }]} ]}>
											<FontAwesome6 name="arrow-up-long"size={16} color="#425C70" />
										</View>
										<View style={[s.arrowIcon, {transform: [{ rotate: "315deg" }]} ]} >
											<FontAwesome6 name="arrow-up-long" size={16} color="#425C70" />
										</View>
									</View>

									<View
										style={{
											flexDirection: "row",
											justifyContent: "center",
											gap: 4,
										}}
									>
										<View style={[s.element, {alignSelf: 'flex-start'}]}>
											<Txt style={s.playoffTxt}>Confirmed Spots</Txt>
											<Txt style={s.playoffNumber}>{confirmed}</Txt>
											<View></View>
										</View>
										<View>
											<View style={s.element}>
												<Txt style={s.playoffTxt}>Advancing from Play‑In</Txt>
												<Txt style={s.playoffNumber}>{advance}</Txt>
											</View>
											<View
												style={[{ alignItems: "center", paddingVertical: 4 }]}
											>
												<FontAwesome6
													name="arrow-up-long"
													size={16}
													color="#425C70"
												/>
											</View>
											<View style={s.element}>
												<Txt style={s.playoffTxt}>Play‑In Spots</Txt>
												<Txt style={s.playoffNumber}>{playIn}</Txt>
											</View>
										</View>
									</View>
								</View>
							</View>
						</ScrollView>
						<TouchableOpacity
							style={s.close}
							onPress={() => setInfoModalVisible(false)}
						>
							<FontAwesome6 name="xmark" size={20} color="#425C70" />
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	);
}

const s = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		backgroundColor: "#061826",
		borderRadius: 9,
		// padding: 20,
		// paddingBottom: 8,
		width: "80%",
		paddingBottom: 16,
	},
	title: {
		fontSize: 20,
		paddingBottom: 4,
	},
	heading: {
		fontSize: 18,
		paddingBottom: 4,
		fontFamily: "Saira_600SemiBold",
	},
	paragraph: {
		fontSize: 14,
		paddingBottom: 8,
	},
	scoringContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingTop: 8,
	},
	scoringItem: {
		alignItems: "center",
	},
	placement: {
		fontSize: "12",
		paddingBottom: 2,
		fontFamily: "Saira_600SemiBold",
	},
	points: {
		fontFamily: "Saira_600SemiBold",
		color: "#54D18C",
		marginBottom: -4,
	},

	element: {
		// paddingLeft: 16,
		alignItems: "center",
		backgroundColor: "#1D394E",
		marginVertical: 2,
		paddingHorizontal: 4,
		paddingVertical: 8,
		borderRadius: 8,
		width: 125,
	},
	playoffTxt: {
		marginBottom: -2,
		fontSize: 12,
		lineHeight: 16,
		textAlign: "center",
	},
	playoffNumber: {
		fontFamily: "Saira_600SemiBold",
		color: "#54D18C",
		// lineHeight: 16,
		marginBottom: -6,
	},
	rotatedIconRow: {
		flexDirection: "row", 
		gap: 32, 
		alignSelf: "center",
	},
	arrowIcon: {
		alignItems: "center",
		paddingVertical: 4,
	},

	close: {
		position: "absolute",
		top: 0,
		right: 0,
		paddingTop: 12,
		paddingRight: 16,
		paddingBottom: 30,
		paddingLeft: 30,
		// backgroundColor: "blue",
	},
});
