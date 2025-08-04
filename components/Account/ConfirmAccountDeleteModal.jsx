import { Modal, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";

export function ConfirmAccountDeleteModal({
	modalVisible,
	onClose,
	onConfirm,
}) {
	return (
		<Modal transparent={true} animationType="fade" visible={modalVisible}>
			<View style={s.overlay}>
				<View style={s.modalContainer}>
					<View style={s.modalHeadingContainer}>
						<Txt style={s.modalHeadingText}>Delete Account</Txt>
						<TouchableOpacity onPress={onClose}>
							<View style={s.closeModalContainer}>
								<FontAwesome6 name="xmark" size={18} color="#F8F8F8" />
							</View>
						</TouchableOpacity>
					</View>

					<View style={s.confirmActionContainer}>
						<Txt style={s.body}>
							Are you sure you want to delete your account? This action is
							irreversible. All your data will be permanently deleted, including:{" "}
						</Txt>
						<View style={{ paddingBottom: 12 }}>
							<View style={s.confirmationSubtextBullets}>
								<FontAwesome6 name="xmark" size={12} color="#E06777" />
								<Txt style={s.confirmationSubtext}>
									Account Info and History
								</Txt>
							</View>
							<View style={s.confirmationSubtextBullets}>
								<FontAwesome6 name="xmark" size={12} color="#E06777" />
								<Txt style={s.confirmationSubtext}>League Memberships</Txt>
							</View>
							<View style={s.confirmationSubtextBullets}>
								<FontAwesome6 name="xmark" size={12} color="#E06777" />
								<Txt style={s.confirmationSubtext}>Bets and Betslips</Txt>
							</View>
						</View>
					</View>
					<View style={s.actions}>
						<Btn
							btnText="Yes, delete account"
							onPress={onConfirm}
							isEnabled={true}
							style={s.deleteBtn}
							fontColor="#F8F8F8"
							fontSize={14}
						/>
						<Btn
							btnText="Cancel"
							onPress={onClose}
							isEnabled={true}
							style={s.cancelBtn}
							fontColor="#061826"
							fontSize={14}
						/>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const s = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.7)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		backgroundColor: "#061826",
		borderRadius: 10,
		// padding: 16,
		width: "80%",
		// alignItems: "center",
	},
	modalHeadingContainer: {
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		// paddingVertical: 8,
		backgroundColor: "#061826",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 12,
	},
	modalHeadingText: {
		fontFamily: "Saira_600SemiBold",
		color: "#F8F8F8",
		fontSize: 18,
	},
	closeModalContainer: {
		// backgroundColor: 'green',
		paddingVertical: 12,
		paddingRight: 6,
		paddingLeft: 12,
	},
	body: {
		fontSize: 14,
		color: "#F8F8F8",
		paddingTop: 12,
		paddingHorizontal: 12,
		// textAlign: "center",
	},
	actions: {
		flexDirection: "row",
		gap: 8,
		paddingVertical: 12,
		paddingHorizontal: 8,
		justifyContent: "center",
	},
	deleteBtn: {
		backgroundColor: "#E06777",
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	cancelBtn: {
		backgroundColor: "#F8F8F8",
		borderWidth: 1,
		borderColor: "#061826",
		paddingHorizontal: 12,
		paddingVertical: 6,
	},

	confirmationSubtext: {
		fontSize: 14,
		// paddingBottom: 16,
		textAlign: "center",
	},
	confirmationSubtextBullets: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	confirmActionContainer: {
		padding: 8,
		alignItems: "center",
	},
});
