import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TextInput,
	Button,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	Dimensions,
	Keyboard,
} from "react-native";
import BottomSheet, {
	BottomSheetScrollView,
	BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Txt } from "../../../components/general/Txt";
import { Btn } from "../../../components/general/Buttons/Btn";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import api from "../../../utils/axiosConfig";
import { router, useLocalSearchParams } from "expo-router";
import { useToastMessage } from "../../../hooks/useToastMessage";

const WEEKS = [
	{ label: "Week 1  (Aug 25 - Aug 31)", value: 1 },
	{ label: "Week 2  (Sept 1 - Sept 7)", value: 2 },
	{ label: "Week 3  (Sept 8 - Sept 14)", value: 3 },
	{ label: "Week 4  (Sept 15 - Sept 21)", value: 4 },
	{ label: "Week 5  (Sept 22 - Sept 28)", value: 5 },
	{ label: "Week 6  (Sept 29 - Oct 5)", value: 6 },
	{ label: "Week 7  (Oct 6 - Oct 12)", value: 7 },
	{ label: "Week 8  (Oct 13 - Oct 19)", value: 8 },
	{ label: "Week 9  (Oct 20 - Oct 26)", value: 9 },
	{ label: "Week 10  (Oct 27 - Nov 2)", value: 10 },
	{ label: "Week 11  (Nov 3 - Nov 9)", value: 11 },
	{ label: "Week 12  (Nov 10 - Nov 16)", value: 12 },
	{ label: "Week 13  (Nov 17 - Nov 23)", value: 13 },
	{ label: "Week 14  (Nov 24 - Nov 30)", value: 14 },
];

export default function CreatePool() {
	const bottomSheetRef = useRef(null);
	const [selectedWeek, setSelectedWeek] = useState(WEEKS[0]);
	const [leagueName, setLeagueName] = useState("");
	const { showError, showSuccess } = useToastMessage();
	const { poolId } = useLocalSearchParams();
	const isEditMode = !!poolId;
	const [currentSeason, setCurrentSeason] = useState(null);
	const [currentLeagueSeason, setCurrentLeagueSeason] = useState(null);
	const isStartWeekLocked = currentLeagueSeason?.["has_started?"];

	const handleSelectWeek = (week) => {
		setSelectedWeek(week);
		bottomSheetRef.current?.close();
	};

	const handleSubmit = async () => {
		if (!leagueName.trim()) {
			showError("Please enter a league name.");
			return;
		}

		try {
			const payload = { name: leagueName };
			if (!isStartWeekLocked) {
				payload.start_week = selectedWeek.value;
			}

			if (isEditMode) {
				await api.patch(`/pools/${poolId}`, payload);
				showSuccess("League updated successfully.");
			} else {
				await api.post("/pools", payload);
				showSuccess("League created successfully.");
			}

			router.back();
		} catch (error) {
			console.error(
				"Failed to submit league:",
				error?.response?.data || error.message
			);
			showError("Something went wrong.");
		}
	};

	useEffect(() => {
		const loadData = async () => {
			try {
				const res = await api.get("/seasons", { params: { limit: 1 } });
				const season = res.data;
				setCurrentSeason(season);

				// Default to latest valid week
				const defaultSelectableWeek = [...WEEKS].find(
					(week) => week.value > season.current_week
				);

				if (!isEditMode && defaultSelectableWeek) {
					setSelectedWeek(defaultSelectableWeek);
				}

				if (isEditMode) {
					const poolRes = await api.get(`/pools/${poolId}`);
					const leagueSeasonsRes = await api.get(
						`/pools/${poolId}/league_seasons`
					);

					setLeagueName(poolRes.data.name);

					const matchingLeagueSeason = leagueSeasonsRes.data.find(
						(ls) => ls.season_id === season.id
					);
					setCurrentLeagueSeason(matchingLeagueSeason);

					if (matchingLeagueSeason) {
						const weekOption = WEEKS.find(
							(w) => w.value === matchingLeagueSeason.start_week
						);
						if (weekOption) setSelectedWeek(weekOption);
					}
				}
			} catch (err) {
				console.error("Error loading data:", err);
			}
		};

		loadData();
	}, []);

	return (
		<View style={s.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					contentContainerStyle={{ paddingBottom: 100 }}
					keyboardShouldPersistTaps="handled"
				>
					<View>
						<Txt style={s.formText}>League Name</Txt>
						<View style={s.textInputContainer}>
							<TextInput
								style={s.inputText}
								placeholder="Enter League Name"
								placeholderTextColor="#C7CDD1"
								value={leagueName}
								onChangeText={setLeagueName}
								autoCapitalize="words"
								onFocus={() => {
									bottomSheetRef.current?.close();
								}}
								autoCorrect={false} // 🚫 Disable autocorrect
								spellCheck={false}
							/>
						</View>

						<View>
							<View style={s.labelWithIcon}>
								<Txt style={s.formText}>Start Week</Txt>
								{isStartWeekLocked && (
									<FontAwesome6 name="lock" size={14} color="#C7CDD1" />
								)}
							</View>

							<TouchableOpacity
								style={[s.weekSelector]}
								disabled={isStartWeekLocked}
								onPress={() => {
									Keyboard.dismiss();
									bottomSheetRef.current?.expand();
								}}
							>
								<View style={s.weekSelectorView}>
									<Txt
										style={[
											s.responseTxt,
											isStartWeekLocked && { color: "#6B8294" }, // gray text
										]}
									>
										{selectedWeek.label}
									</Txt>
									<FontAwesome6
										name="chevron-down"
										size={16}
										color={isStartWeekLocked ? "#6B8294" : "#F8F8F8"} // gray icon
									/>
								</View>
							</TouchableOpacity>
						</View>

						<Btn
							style={s.btn}
							btnText={isEditMode ? "Save Changes" : "Create League"}
							onPress={handleSubmit}
							isEnabled={true}
						/>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>

			<BottomSheet
				ref={bottomSheetRef}
				index={-1}
				// snapPoints={snapPoints}
				enablePanDownToClose
				maxDynamicContentSize={320}
				backgroundStyle={{ backgroundColor: "#1D394E" }}
				handleIndicatorStyle={{ backgroundColor: "#F8F8F8" }} // the top little "handle" bar
			>
				<BottomSheetScrollView style={s.sheetContainer}>
					{WEEKS.filter(
						(week) => currentSeason && week.value > currentSeason.current_week
					).map((week) => (
						<TouchableOpacity
							key={week.value}
							style={s.radioItem}
							onPress={() => handleSelectWeek(week)}
						>
							<View style={s.radioCircle}>
								{selectedWeek.value === week.value && (
									<View style={s.radioSelected} />
								)}
							</View>
							<Txt style={s.radioLabel}>{week.label}</Txt>
						</TouchableOpacity>
					))}
				</BottomSheetScrollView>
			</BottomSheet>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#061826",
		padding: 8,
	},
	textInputContainer: {
		paddingVertical: 4,
	},
	inputText: {
		fontFamily: "Saira_600SemiBold",
		borderColor: "#1D394E",
		borderWidth: 1,
		borderRadius: 8,
		height: 48,
		paddingHorizontal: 8,
		fontSize: 14,
		color: "#F8F8F8",
	},
	formText: {
		color: "#F8F8F8",
		fontSize: 20,
	},
	btn: {
		paddingVertical: 12,
		paddingHorizontal: 12,
		marginTop: 24,
	},
	weekSelector: {
		// backgroundColor: "#DAE1E5",
		borderWidth: 1,
		borderColor: "#1D394E",
		borderRadius: 8,
		padding: 12,
		marginTop: 8,
	},
	weekSelectorView: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	responseTxt: {
		fontFamily: "Saira_600SemiBold",
		fontSize: 14,
	},
	sheetContainer: {
		padding: 16,
	},
	radioItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
	},
	radioCircle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#F8F8F8",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 12,
	},
	radioSelected: {
		height: 10,
		width: 10,
		borderRadius: 5,
		backgroundColor: "#F8F8F8",
	},
	radioLabel: {
		fontSize: 16,
		color: "#F8F8F8",
	},
	labelWithIcon: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
});
