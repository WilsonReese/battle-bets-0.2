import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../../general/Txt";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { LeagueStandingsRow } from "./LeagueStandingsRow";
import { PaginatedFlatList } from "../../general/PaginatedFlatList";
import { usePoolDetails } from "../../contexts/PoolDetailsContext";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { SeasonScoringModal } from "./SeasonScoringModal";

export function LeagueStandingsTable({ poolId, containerWidth }) {
	const { selectedSeason, standings } = usePoolDetails(poolId);
	const [infoModalVisible, setInfoModalVisible] = useState(false);

	const leaderboardEntries = standings || [];

	return (
		<>
			<View style={s.titleContainer}>
				<Txt style={s.title}>Season Standings</Txt>
				<TouchableOpacity
					style={s.infoButton}
					onPress={() => setInfoModalVisible(true)}
				>
					<FontAwesome6 name="circle-info" size={18} color="#F8F8F8" />
				</TouchableOpacity>
			</View>
			<View style={s.headerContainer}>
				<View style={s.rankHeader}>
					<Txt style={s.headerTxt}>Rank</Txt>
				</View>
				<View style={s.playerHeader}>
					<Txt style={s.headerTxt}>Player</Txt>
				</View>
				<View style={s.scoreHeader}>
					<Txt style={s.headerTxt}>Score</Txt>
				</View>
				<View style={s.headerElement} />
			</View>
			<PaginatedFlatList
				data={leaderboardEntries}
				itemsPerPage={15}
				containerWidth={containerWidth}
				renderItemRow={(entry, index, total) => (
					<LeagueStandingsRow
						key={entry.id}
						entry={entry}
						isLast={index === total - 1}
					/>
				)}
			/>
			<SeasonScoringModal
				infoModalVisible={infoModalVisible}
				setInfoModalVisible={setInfoModalVisible}
				leagueSize={leaderboardEntries.length}
			/>
		</>
	);
}

const s = StyleSheet.create({
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	title: {
		fontSize: 20,
		color: "#F8F8F8",
		marginBottom: 8,
	},
	infoButton: {
		paddingVertical: 2,
		paddingHorizontal: 4,
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 0.5,
		borderColor: "#3A454D",
	},
	rankHeader: {
		width: 60,
		alignItems: "center",
	},
	playerHeader: {
		flex: 20,
	},
	scoreHeader: {
		width: 80,
		alignItems: "center",
	},
	headerTxt: {
		color: "#F8F8F8",
		fontSize: 12,
	},
});
