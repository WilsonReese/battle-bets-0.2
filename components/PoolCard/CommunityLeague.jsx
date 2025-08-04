import {
	ActivityIndicator,
	Image,
	ImageBackground,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Txt } from "../general/Txt";
import { AnnouncementsCard } from "./AnnouncementsCard";
import { useContext, useEffect, useState } from "react";
import { useToastMessage } from "../../hooks/useToastMessage";
import { AuthContext } from "../contexts/AuthContext";
import api from "../../utils/axiosConfig";
// import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function CommunityLeague({ league, loading, onJoinSuccess }) {
	// const [league, setLeague] = useState(null);
	// const [loading, setLoading] = useState(true);
	const { currentUserId } = useContext(AuthContext);
	const { showSuccess, showError } = useToastMessage();

	const handleJoin = async () => {
		try {
			await api.post(`/pools/${league.id}/pool_memberships`, {
				user_id: currentUserId,
				invite_token: league.invite_token,
			});
			showSuccess("Joined league successfully");
			onJoinSuccess();
		} catch (err) {
			// console.error("Error joining league:", err);
			showError("Already joined league");
		}
	};

	console.log("Community League");

	return (
		<>
			<TouchableOpacity
				style={s.container}
				disabled={loading || !league}
				onPress={handleJoin}
			>
				<ImageBackground
					source={require("@/assets/images/community-league.png")} // Path to your logo
					style={s.background}
					// resizeMode='center'
					imageStyle={s.imageCorners}
				>
					{loading ? (
						<ActivityIndicator color="#FFF" />
					) : !league ? (
						<Txt style={s.title}>Community League Unavailable</Txt>
					) : (
						<View style={s.contentContainer}>
							<Txt style={s.title}>Join the Battle Bets Community League!</Txt>
							<View style={s.callToAction}>
								<Txt style={s.txt}>
									Play with {league.membership_count} members
								</Txt>
								<FontAwesome6
									name="circle-chevron-right"
									size={16}
									color="#54D18C"
								/>
							</View>
						</View>
					)}
				</ImageBackground>
			</TouchableOpacity>
		</>
	);
}

const s = StyleSheet.create({
	container: {
		height: 120,
		width: "100%",
		// backgroundColor: "green",
		borderRadius: 8,
		borderWidth: 2,
		overflow: "hidden",
		borderColor: "#0F2638",
		alignItems: "center",
		justifyContent: "center",
	},
	background: {
		flex: 1, // fill the entire container
		justifyContent: "center", // center children vertically
		alignItems: "center", // center children horizontally
	},
	imageCorners: {
		borderRadius: 8, // makes the ImageBackground itself respect the corners
	},
	contentContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		// backgroundColor: 'green',
		paddingHorizontal: 16,
		gap: 8,
	},
	title: {
		fontFamily: "Saira_600SemiBold",
		textAlign: "center",
		lineHeight: 20,
		paddingTop: 8,
		fontSize: 18,
		// backgroundColor: 'blue',
	},
	txt: {
		fontSize: 14,
	},
  callToAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  }
});
