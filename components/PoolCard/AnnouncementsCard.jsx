import { Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DISMISS_KEY = "dismissedAnnouncementId";

export function AnnouncementsCard({ response }) {
	const { id, title, paragraph, link } = response;

  console.log(response)

	const hasLink = Boolean(response.link);

	const [dismissedId, setDismissedId] = useState(null);
	const [visible, setVisible] = useState(false);

	// load dismissed id on mount
	useEffect(() => {
		AsyncStorage.getItem(DISMISS_KEY)
			.then((stored) => {
				setDismissedId(stored != null ? parseInt(stored, 10) : null);
			})
			.catch(console.warn);
	}, []);

	// whenever either response id or dismissedId changes, decide visibility
	useEffect(() => {
		setVisible(id !== dismissedId);
	}, [id, dismissedId]);

	const handleOpen = () => {
		if (hasLink) {
			Linking.openURL(link).catch((err) =>
				console.error("Failed to open link:", err)
			);
		}
	};

	const handleDismiss = useCallback(() => {
		AsyncStorage.setItem(DISMISS_KEY, id.toString())
			.then(() => setDismissedId(id))
			.catch(console.warn);
	}, [id]);

	if (!visible) return null;

	return (
		<TouchableOpacity
			style={[s.container, !hasLink && s.containerDisabled]}
			onPress={handleOpen}
			disabled={!hasLink}
		>
			<Txt>{title}</Txt>
			<Txt style={s.paragraphTxt} numberOfLines={2} ellipsizeMode="tail">
				{paragraph}
				{hasLink && (
					<>
						<View style={{ width: 4 }} />
						<FontAwesome6
							name="circle-chevron-right"
							size={12}
							color="#54D18C"
						/>
					</>
				)}
			</Txt>
			<TouchableOpacity style={s.close} onPress={handleDismiss}>
				<FontAwesome6 name="xmark" size={16} color="#6B8294" />
			</TouchableOpacity>
		</TouchableOpacity>
	);
}

const s = StyleSheet.create({
	container: {
		backgroundColor: "#1D394E",
		borderRadius: 8,
		paddingVertical: 6,
		paddingHorizontal: 10,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: '#54D18C',
		shadow: {
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 2,
			},
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5,
		},
	},
	headerTxt: {},
	paragraphTxt: {
		fontSize: 12,
		// lineHeight: 19,
	},
	close: {
		position: "absolute",
		top: 0,
		right: 0,
		paddingTop: 10,
		paddingRight: 12,
		paddingBottom: 30,
		paddingLeft: 30,
		// backgroundColor: 'blue'
	},
});
