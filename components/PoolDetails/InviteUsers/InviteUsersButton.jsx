import * as Linking from "expo-linking";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Txt } from "../../general/Txt";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Clipboard from "expo-clipboard";
import { useToastMessage } from "../../../hooks/useToastMessage";

export function InviteUsersButton({
	poolId,
	inviteToken,
	style,
	textStyle,
	iconColor = "#54D18C",
}) {
	const { showSuccess, showError } = useToastMessage();

	// const handleCopyLink = async () => {
	//   try {
	//     // let url: string;

	//     // if (__DEV__) {
	//     //   // In dev / Expo Go: deep‑link into the JS bundle
	//     //   url = Linking.createURL("/join", {
	//     //     queryParams: { pool_id: poolId, token: inviteToken },
	//     //   });
	//     // } else {
	//     //   // In a standalone build or web: hit your public Cloudflare Page
	//     //   url = `https://join.battlebets.app/join?pool_id=${poolId}&token=${inviteToken}`;
	//     // }

	// 		url = `https://join.battlebets.app/join?pool_id=${poolId}&token=${inviteToken}`;
	//     await Clipboard.setStringAsync(url);
	//     showSuccess("Invitation link copied!");
	//   } catch (e) {
	//     console.error(e);
	//     showError("Failed to copy invitation link.");
	//   }
	// };

	const handleCopyLink = async () => {
		try {
			let url;

			if (__DEV__) {
				// in Expo Go / local dev bundle, deep-link into your JS
				url = Linking.createURL("/join", {
					queryParams: { pool_id: poolId, token: inviteToken },
				});
			} else {
				// in standalone / web builds, hit your published Cloudflare page
				url = `https://join.battlebets.app/join?pool_id=${poolId}&token=${inviteToken}`;
			}

			await Clipboard.setStringAsync(url);
			showSuccess("Invitation link copied!");
		} catch (e) {
			console.error(e);
			showError("Failed to copy invitation link.");
		}
	};

	return (
		<>
			<TouchableOpacity style={[s.button, style]} onPress={handleCopyLink}>
				<Txt style={textStyle}>Copy League Invitation Link</Txt>
				<FontAwesome6 name="link" size={16} color={iconColor} />
			</TouchableOpacity>
		</>
	);
}

const s = StyleSheet.create({
	button: {
		// paddingHorizontal: 12,
		paddingVertical: 8,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
		// backgroundColor: 'green'
	},
});
