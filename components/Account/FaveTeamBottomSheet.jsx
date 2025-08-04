import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Txt } from "../general/Txt";
import { useMemo, useRef } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { TeamLogo } from "../GameCard/Matchup/TeamLogo";

const FBS_CONFERENCES = [
	"American",
	"ACC",
	"Big 12",
	"Big Ten",
	"Conference USA",
	"FBS Independents",
	"Mid-American",
	"Mountain West",
	"Pac-12",
	"SEC",
	"Sun Belt",
];

export function FaveTeamBottomSheet({
	loading,
	teams,
	favoriteTeamId,
	setFavoriteTeamId,
	sheetRef,
  closeTeamSheet
}) {
	// const sheetRef = useRef(null);
	// const openTeamSheet = () => sheetRef.current?.expand?.();

	const teamsByConference = useMemo(() => {
		return FBS_CONFERENCES.map((conf) => {
			const list = teams
				.filter((t) => t.conference === conf)
				.sort((a, b) => a.name.localeCompare(b.name));
			return { conference: conf, teams: list };
		}).filter((sec) => sec.teams.length > 0);
	}, [teams]);

	return (
		<>
			<BottomSheet
				ref={sheetRef}
				index={-1}
				maxDynamicContentSize={620}
				enablePanDownToClose
				onClose={closeTeamSheet}
				backgroundStyle={s.sheetBackground}
				handleIndicatorStyle={{ backgroundColor: "#F8F8F8" }}
			>
				<BottomSheetScrollView contentContainerStyle={s.sheetContent}>
					{loading && (
						<>
							<ActivityIndicator />
						</>
					)}
					{/* Render each non‑empty conference section in order */}
					{!loading && (
						<>
							<Txt style={s.title}>Choose your favorite team from the list below.</Txt>
							{teamsByConference.map(({ conference, teams }) => (
								<View key={conference} style={s.confSection}>
									{conference === teamsByConference[0].conference && (
										<TouchableOpacity
											style={[
												s.teamItem,
												favoriteTeamId === null && s.selectedTeamItem,
											]}
											onPress={() => {
												setFavoriteTeamId(null);
												closeTeamSheet();
											}}
										>
											<Txt>None</Txt>
										</TouchableOpacity>
									)}
									<Txt style={s.conferenceHeader}>{conference}</Txt>
									<View style={s.teamGrid}>
										{/* “None” only once, so you can render it before the first section if you like */}
										{teams.map((team) => (
											<TouchableOpacity
												key={team.id}
												style={[
													s.teamItem,
													favoriteTeamId === team.id && s.selectedTeamItem,
												]}
												onPress={() => {
													setFavoriteTeamId(team.id);
													closeTeamSheet();
												}}
											>
												<TeamLogo teamName={team.name} size={30} />
												<Txt
													numberOfLines={1}
													ellipsizeMode="tail"
													style={s.teamName}
												>
													{team.name}
												</Txt>
											</TouchableOpacity>
										))}
									</View>
								</View>
							))}
						</>
					)}
				</BottomSheetScrollView>
			</BottomSheet>
		</>
	);
}

const s = StyleSheet.create({
	sheetBackground: {
		backgroundColor: "#0F2638",
		// alignItems: 'center'
	},
	sheetContent: {
		paddingHorizontal: 6,
		paddingBottom: 40,
	},
  title: {
    fontFamily: 'Saira_400Regular_Italic',
    fontSize: 16,
    paddingBottom: 12,
    paddingTop: 8,
    alignSelf:'center'
  },
	bottomSheetContainer: {
		alignItems: "center",
	},
	teamGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		// alignSelf: "center",
	},
	teamItem: {
		// padding: 4,
		height: 90,
		width: 90,
		alignItems: "center",
		backgroundColor: "#1D394E",
		borderRadius: 8,
		justifyContent: "center",
		margin: 2,
	},
	teamName: {
		fontSize: 12,
	},
	selectedTeamItem: {
		backgroundColor: "#54D18C",
	},
	conferenceHeader: {
		fontFamily: "Saira_600SemiBold",
		paddingTop: 8,
		paddingHorizontal: 4,
		fontSize: 16,
	},
});
