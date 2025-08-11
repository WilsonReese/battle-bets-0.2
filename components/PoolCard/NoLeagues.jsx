import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { AnnouncementsCard } from "./AnnouncementsCard";

export function NoLeagues({ response }) {
	return (
		<>
			{response?.id && <AnnouncementsCard response={response} />}
			<View style={s.emptyStateContainer}>
				<Txt style={s.emptyTitle}>No leagues joined yet</Txt>
				<Txt>Create a league</Txt>
				<Txt style={s.emptySubtitle}>or</Txt>
				<Txt>Join a league using an invitation link</Txt>
			</View>
		</>
	);
}

const s = StyleSheet.create({
	emptyStateContainer: {
		marginVertical: 32,
		paddingHorizontal: 16,
		alignItems: "center",
	},
	emptyTitle: {
		color: "#F8F8F8",
		fontSize: 20,
		fontWeight: "600",
		marginBottom: 24,
	},
	emptySubtitle: {
		color: "#C7CDD1",
		fontSize: 14,
		textAlign: "center",
		lineHeight: 20,
	},
});
