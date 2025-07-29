import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
	Image,
	StyleSheet,
	View,
} from "react-native";
import { Txt } from "../general/Txt";

export function Step({ text, aspectRatio, imagePath }) {

	return (
		<>
			<View style={s.step}>
				<Txt style={s.paragraph}>
					{text}
				</Txt>
				<Image
					source={imagePath}
					style={[s.image, {aspectRatio: aspectRatio}]}
					resizeMode="contain"
					resizeMethod="auto"
					width="100%"
				/>
			</View>
		</>
	);
}

const s = StyleSheet.create({
	step: {
		paddingVertical: 8,
	},
  paragraph: {
    fontSize: 14,
  },

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
		// padding: 2,
	},
});
