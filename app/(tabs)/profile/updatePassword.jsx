import { useState, useContext } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Txt } from "../../../components/general/Txt";
import { Btn } from "../../../components/general/Buttons/Btn";
import { useToastMessage } from "../../../hooks/useToastMessage";
import { AuthContext } from "../../../components/contexts/AuthContext";
import { API_BASE_URL } from "../../../utils/api";
import { router } from "expo-router";

export default function UpdatePassword() {
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [fieldErrors, setFieldErrors] = useState({});
	const { token } = useContext(AuthContext);
	const { showError, showSuccess } = useToastMessage();

	const validate = () => {
		const errors = {};
		if (!newPassword.trim()) errors.password = ["Password is required."];
		if (!confirmPassword.trim())
			errors.password_confirmation = ["Password confirmation is required."];
		if (newPassword.length < 8)
			errors.password = [
				...(errors.password || []),
				"Password must be at least 8 characters.",
			];
		if (newPassword !== confirmPassword)
			errors.password_confirmation = [
				...(errors.password_confirmation || []),
				"Password confirmation does not match.",
			];
		return errors;
	};

	const handleChangePassword = async () => {
		const errors = validate();
		setFieldErrors(errors);
		if (Object.keys(errors).length > 0) return;

		try {
			const res = await fetch(`${API_BASE_URL}/users/change_password`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					password: newPassword,
					password_confirmation: confirmPassword,
				}),
			});

			if (res.ok) {
				showSuccess("Password updated.");
				router.replace("/(tabs)/profile");
			} else {
				const data = await res.json();
				showError(data.errors?.join(", ") || "Failed to update password.");
			}
		} catch (err) {
			showError("Something went wrong.");
			console.error("Change password error:", err);
		}
	};

	return (
		<View style={s.container}>
			<Txt style={s.titleTxt}>Update Password</Txt>

			<Txt>New Password</Txt>
			<TextInput
				placeholder="New Password"
				placeholderTextColor="#B8C3CC"
				style={s.input}
				secureTextEntry
				textContentType="newPassword" // ✅ Tells iOS this is a new password
				autoComplete="password-new" // ✅ Optional, helps reinforce it
				onChangeText={(val) => {
					setNewPassword(val);
					setFieldErrors((prev) => ({ ...prev, password: undefined }));
				}}
			/>
			{fieldErrors.password && (
				<Txt style={s.inlineError}>{fieldErrors.password.join(" ")}</Txt>
			)}

			<Txt>Confirm Password</Txt>
			<TextInput
				placeholder="Confirm Password"
				placeholderTextColor="#B8C3CC"
				style={s.input}
				secureTextEntry
				onChangeText={(val) => {
					setConfirmPassword(val);
					setFieldErrors((prev) => ({
						...prev,
						password_confirmation: undefined,
					}));
				}}
			/>
			{fieldErrors.password_confirmation && (
				<Txt style={s.inlineError}>
					{fieldErrors.password_confirmation.join(" ")}
				</Txt>
			)}

			<Btn
				btnText="Save Password"
				isEnabled={true}
				style={s.btn}
				onPress={handleChangePassword}
			/>

			<TouchableOpacity onPress={() => router.back()} style={s.backButton}>
				<Txt>Back to Profile</Txt>
			</TouchableOpacity>
		</View>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#061826",
		padding: 16,
	},
	titleTxt: {
		color: "#F8F8F8",
		fontSize: 24,
	},
	input: {
		fontFamily: "Saira_600SemiBold",
		height: 48,
		// backgroundColor: "#F8F8F8",
		borderColor: "#3A454D",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		// marginTop: 4,
		marginBottom: 12,
		color: "#F8F8F8",
		fontSize: 14,
	},
	inlineError: {
		fontFamily: "Saira_400Regular_Italic",
		color: "#E06777",
		fontSize: 12,
		marginTop: -8,
		marginBottom: 8,
	},
	btn: {
		paddingVertical: 12,
		marginTop: 8,
	},
	backButton: {
		marginTop: 12,
		alignItems: "center",
		// backgroundColor: 'blue',
		paddingVertical: 4,
	},
});
