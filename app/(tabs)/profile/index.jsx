import React, { useContext, useEffect, useRef, useState } from "react";
import {
	View,
	StyleSheet,
	Button,
	TextInput,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Keyboard,
	Platform,
	TouchableOpacity,
	ScrollView,
	RefreshControl,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import api from "../../../utils/axiosConfig";
import { AuthContext } from "../../../components/contexts/AuthContext";
import { useToastMessage } from "../../../hooks/useToastMessage";
import { Txt } from "../../../components/general/Txt";
import { Btn } from "../../../components/general/Buttons/Btn";
import { formatFullDate } from "../../../utils/dateUtils";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TeamsByConference } from "./TeamsByConference";

export default function Profile() {
	const { logout, token } = useContext(AuthContext);
	const router = useRouter();
	const { showError, showSuccess } = useToastMessage();
	const [refreshing, setRefreshing] = useState(false);

	const [user, setUser] = useState(null);
	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		username: "",
	});
	const [errors, setErrors] = useState({});
	const [isEditing, setIsEditing] = useState(false);
	const hasFocusedOnce = useRef(false);

	const fetchCurrentUser = async () => {
		try {
			const res = await api.get("/current_user");
			setUser(res.data);
			setForm({
				first_name: res.data.first_name,
				last_name: res.data.last_name,
				username: res.data.username,
			});
		} catch (err) {
			console.error("Error fetching user:", err.message);
			showError("Failed to load user profile.");
		}
	};

	useEffect(() => {
		fetchCurrentUser();
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchCurrentUser();
		setRefreshing(false);
	};

	const validateForm = () => {
		const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]{2,19}$/;
		const errs = {};

		if (!form.first_name.trim() || !form.last_name.trim()) {
			errs.name = "First and last name are required.";
		}

		if (!usernameRegex.test(form.username)) {
			errs.username =
				"must be 3–20 characters, use letters/numbers/underscores only, and start with a letter or underscore.";
		}

		return errs;
	};

	const handleSave = async () => {
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			const res = await api.patch("/users/update_profile", form);
			setUser(res.data);
			showSuccess("Profile updated.");
			setErrors({});
			setIsEditing(false);
		} catch (err) {
			const backendErrors = err?.response?.data?.errors;
			if (backendErrors) {
				// Merge backend errors into current error state
				const mapped = {};
				for (const [key, value] of Object.entries(backendErrors)) {
					mapped[key] = value.join(", ");
				}
				setErrors(mapped);
			} else {
				showError("Failed to update profile.");
			}
		}
	};

	const handleEditToggle = () => {
		if (isEditing) {
			handleSave();
		} else {
			setIsEditing(true);
		}
	};

	const handleLogout = async () => {
		try {
			const res = await api.delete("/logout", {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (res.status === 200) {
				await logout();
				showSuccess("Logged out successfully.");
				router.replace("/login");
			} else {
				showError("Logout failed. Try again.");
			}
		} catch (err) {
			console.error("Logout error:", err.message);
			showError("An error occurred.");
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			if (hasFocusedOnce.current) {
				// Only reset if we've visited this screen before
				setIsEditing(false);
				if (user) {
					setForm({
						first_name: user.first_name,
						last_name: user.last_name,
						username: user.username,
					});
				}
				setErrors({});
			} else {
				// First time focusing, skip reset
				hasFocusedOnce.current = true;
			}
		}, [user])
	);

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				style={{ flex: 1 }}
			>
				<ScrollView
					style={s.container}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor="#C7CDD1"
						/>
					}
				>
					<View style={s.titleContainer}>
						<Txt style={s.titleTxt}>Profile</Txt>
						<Btn
							btnText={isEditing ? "Save" : "Edit"}
							isEnabled={true}
							fontSize={14}
							style={s.btn}
							onPress={handleEditToggle}
						/>
					</View>

					{user ? (
						<>
							{/* Name Row */}
							<View style={s.detailsRow}>
								<Txt style={s.labelTxt}>Name:</Txt>
								{isEditing ? (
									<View style={{ flex: 1 }}>
										<View style={s.nameInputs}>
											<TextInput
												style={s.input}
												value={form.first_name}
												placeholder="First Name"
												placeholderTextColor="#B8C3CC"
												onChangeText={(text) =>
													setForm((prev) => ({ ...prev, first_name: text }))
												}
												autoCorrect={false} // 🚫 Disable autocorrect
												spellCheck={false}
											/>
											<TextInput
												style={s.input}
												value={form.last_name}
												placeholder="Last Name"
												placeholderTextColor="#B8C3CC"
												onChangeText={(text) =>
													setForm((prev) => ({ ...prev, last_name: text }))
												}
												autoCorrect={false} // 🚫 Disable autocorrect
												spellCheck={false}
											/>
										</View>
										{errors.name && (
											<Txt style={s.inlineError}>{errors.name}</Txt>
										)}
									</View>
								) : (
									<Txt
										style={s.txt}
									>{`${form.first_name} ${form.last_name}`}</Txt>
								)}
							</View>

							<View style={s.detailsRow}>
								<Txt style={s.labelTxt}>Username:</Txt>
								{isEditing ? (
									<View style={{ flex: 1 }}>
										<View style={s.usernameInputWrapper}>
											<TextInput
												style={s.input}
												value={form.username}
												placeholder="Username"
												placeholderTextColor="#B8C3CC"
												autoCorrect={false} // 🚫 Disable autocorrect
												spellCheck={false}
												autoCapitalize="none"
												onChangeText={(text) =>
													setForm((prev) => ({ ...prev, username: text }))
												}
											/>
										</View>
										{errors.username && (
											<Txt style={s.inlineError}>
												Username {errors.username}
											</Txt>
										)}
									</View>
								) : (
									<Txt style={s.txt}>{form.username}</Txt>
								)}
							</View>

							{/* Email */}
							<View style={s.detailsRow}>
								<Txt style={s.labelTxt}>Email:</Txt>
								<Txt style={s.txt}>{user.email}</Txt>
							</View>

							{/* Member Since */}
							<View style={s.detailsRow}>
								<Txt style={s.labelTxt}>Member Since:</Txt>
								<Txt style={s.txt}>{formatFullDate(user.created_at)}</Txt>
							</View>
						</>
					) : (
						<Txt style={s.txt}>Loading user info...</Txt>
					)}

					<View style={s.settingsContainer}>
						<TouchableOpacity
							style={s.settingsButton}
							onPress={() => router.push("/profile/updatePassword")}
						>
							<Txt style={s.txt}>Change password</Txt>
							<FontAwesome6
								name="lock"
								size={18}
								color="#F8F8F8"
								style={{ paddingRight: 2 }}
							/>
						</TouchableOpacity>

						<TouchableOpacity style={s.settingsButton} onPress={handleLogout}>
							<Txt style={s.logoutTxt}>Logout</Txt>
							<FontAwesome6
								name="arrow-right-from-bracket"
								size={18}
								color="#E06777"
							/>
						</TouchableOpacity>

						<TeamsByConference/>

					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#061826",
		padding: 8,
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	titleTxt: {
		color: "#F8F8F8",
		fontSize: 24,
	},
	btn: {
		paddingVertical: 2,
		paddingHorizontal: 12,
	},
	detailsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginVertical: 4,
	},
	labelTxt: {
		fontFamily: "Saira_400Regular_Italic",
		fontSize: 14,
		color: "#B8C3CC",
		width: 100,
	},
	txt: {
		color: "#F8F8F8",
		fontFamily: "Saira_600SemiBold",
		// flex: 1,
	},
	input: {
		fontFamily: "Saira_600SemiBold",
		height: 40,
		borderColor: "#3A454D",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 8,
		color: "#F8F8F8",
		fontSize: 14,
		flex: 1,
	},
	nameInputs: {
		// flex: 1,
		flexDirection: "row",
		gap: 4,
	},
	usernameInputWrapper: {
		flexDirection: "row",
		gap: 4,
	},
	inlineError: {
		fontFamily: "Saira_400Regular_Italic",
		color: "#E06777",
		fontSize: 12,
		// marginTop: -4,
		marginBottom: 4,
		// marginLeft: 108, // aligns with label width + gap
	},
	settingsContainer: {
		paddingTop: 24,
	},
	settingsButton: {
		paddingHorizontal: 8,
		paddingVertical: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	logoutTxt: {
		color: "#E06777",
	},
});
