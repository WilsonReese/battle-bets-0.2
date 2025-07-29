import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
	Dimensions,
	Image,
	Modal,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { Txt } from "../general/Txt";
import { Step } from "./Step";
import { PaginatedFlatList } from "../general/PaginatedFlatList";

export function HowToPlayModal({ showHowToPlay, setShowHowToPlay }) {
	const { height: screenHeight, width: screenWidth } = Dimensions.get("window");
	const maxModalHeight = screenHeight * 0.7;
	const maxModalWidth = screenWidth * 0.8;

	const pages = [
		{
			title: "Creating Leagues",
			steps: [
				{
					text: '1. Press the "Create a League" button on the Leagues screen.',
					imagePath: require("@/assets/images/how-to-play/create-a-league.png"),
					aspectRatio: 1080 / 1000,
				},
				{
					text: '2. Fill out the league name and select the start week. Press the "Create League" button.',
					imagePath: require("@/assets/images/how-to-play/enter-league-details.png"),
					aspectRatio: 1080 / 800,
				},
				{
					text: '3. Press the "Copy League Invitation Link" and send it to your friends.',
					imagePath: require("@/assets/images/how-to-play/invite-users.png"),
					aspectRatio: 1080 / 800,
				},
			],
		},
		{
			title: "Placing Bets",
			steps: [
				{
					text: '1. Go to the Bet Selection screen from the Leagues screen...',
					imagePath: require("@/assets/images/how-to-play/nav-to-bets-1.png"),
					aspectRatio: 1080 / 425,
				},
				{
					text: `...Or from the specific League's page`,
					imagePath: require("@/assets/images/how-to-play/nav-to-bets-2.png"),
					aspectRatio: 1080 / 1100,
				},
								{
					text: `2. Browse bet options and place your bets.`,
					imagePath: require("@/assets/images/how-to-play/place-bets.png"),
					aspectRatio: 1080 / 1500,
				},
				// …etc…
			],
		},
		{
			title: "Tracking Bets",
			steps: [
				{
					text: '1. The Scoreboard shows your bets on a specific game for every league',
					imagePath: require("@/assets/images/how-to-play/track-your-bets.png"),
					aspectRatio: 1080 / 975,
				},
				{
					text: `2. See betslips for the entire league on the Battle Leaderboard`,
					imagePath: require("@/assets/images/how-to-play/view-betslip.png"),
					aspectRatio: 1080 / 1625,
				},
								{
					text: `3. View results of each Battle on each League's page.`,
					imagePath: require("@/assets/images/how-to-play/earn-points.png"),
					aspectRatio: 1220 / 1625,
				},
				// …etc…
			],
		},
		// …add more pages as needed…
	];

	return (
		<>
			<Modal transparent={true} animationType="fade" visible={showHowToPlay}>
				<View style={s.overlay}>
					<TouchableWithoutFeedback onPress={() => setShowHowToPlay(false)}>
						<View style={StyleSheet.absoluteFill} />
					</TouchableWithoutFeedback>

					<View
						style={[
							s.container,
							{ maxHeight: maxModalHeight, maxWidth: maxModalWidth },
						]}
					>
						<Txt style={s.title}>How to play</Txt>
						<PaginatedFlatList
							data={pages}
							isComponentPages
							containerWidth={maxModalWidth}
							renderItemRow={(page) => (
								<ScrollView contentContainerStyle={s.pageContent}>
									<Txt style={s.heading}>{page.title}</Txt>
									{page.steps.map((step, i) => (
										<Step
											key={i}
											text={step.text}
											imagePath={step.imagePath}
											aspectRatio={step.aspectRatio}
										/>
									))}
								</ScrollView>
							)}
						/>

						{/* Close Modal */}
						<TouchableOpacity
							style={s.close}
							onPress={() => setShowHowToPlay(false)}
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
		backgroundColor: "rgba(0,0,0,0.9)",
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		backgroundColor: "#061826",
		borderRadius: 9,
		// padding: 20,
		// paddingBottom: 8,
		// width: "80%",
		paddingBottom: 16,
	},
	title: {
		fontSize: 20,
		paddingBottom: 4,
		paddingTop: 8,
		paddingHorizontal: 8
	},
	heading: {
		fontSize: 18,
		paddingBottom: 4,
		fontFamily: "Saira_600SemiBold",
	},
	paragraph: {
		fontSize: 14,
		// paddingBottom: 8,
	},
	step: {
		paddingVertical: 8,
	},

	pageContent: { padding: 8 },

	// IMAGE STYLES
	image: {
		width: "100%", // fill modal’s width
		height: undefined, // let aspectRatio drive height
		// aspectRatio: 1080 / 917,  // (original image width / height)
		// marginTop: 16,
		borderWidth: 2,
		borderColor: "#1D394E",
		borderRadius: 8,
		marginTop: 4,
		padding: 2,
	},
	createALeague: {
		aspectRatio: 1080 / 917, // (original image width / height)
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
