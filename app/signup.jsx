import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	KeyboardAvoidingView,
	ScrollView,
	Platform,
	Keyboard,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useToastMessage } from "../hooks/useToastMessage";
import api from "../utils/axiosConfig";
import { Btn } from "../components/general/Buttons/Btn";
import { Txt } from "../components/general/Txt";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../utils/api";
import { AuthContext } from "../components/contexts/AuthContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { LoadingIndicator } from "../components/general/LoadingIndicator";
import { TeamLogo } from "../components/GameCard/Matchup/TeamLogo";
import { useConferences } from "../hooks/useConferences";
import { ConferenceFilter } from "../components/GameCard/ConferenceFilter";
import { FaveTeamBottomSheet } from "../components/CreateAccount/FaveTeamBottomSheet";
import { UserAgreement } from "../components/CreateAccount/userAgreement";

const FBS_CONFERENCES = [
	"American",
	"ACC",
	"Big 12",
	"Big Ten",
	"Conference USA",
	"FBS Independents",
	"Mid-American",
	"Mountain West",
	"Pac-12",
	"SEC",
	"Sun Belt",
];

export default function SignupScreen() {
	const { login } = useContext(AuthContext);
	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		username: "",
		email: "",
		password: "",
		password_confirmation: "",
	});
	const [fieldErrors, setFieldErrors] = useState({});
	const [signupDisabled, setSignupDisabled] = useState(false);
	const [favoriteTeamId, setFavoriteTeamId] = useState(null);
	const [loading, setLoading] = useState(true);

	const { showError, showSuccess } = useToastMessage();

	// Teams State
	const [teams, setTeams] = useState([]);
	const sheetRef = useRef(null);
	const openTeamSheet = () => {
		Keyboard.dismiss();
		sheetRef.current?.expand();
	};
	const closeTeamSheet = () => sheetRef.current?.close?.();

	// fetch all teams once
	useEffect(() => {
		api
			.get("/teams")
			.then((res) => setTeams(res.data))
			.catch((err) => console.error("Failed to fetch teams", err))
			.finally(() => setLoading(false));
	}, []);

	// Ambassador Stuff
	const [ambassadors, setAmbassadors] = useState([]);
	const [loadingAmbassadors, setLoadingAmbassadors] = useState(false);
	const [ambassadorError, setAmbassadorError] = useState(null);
	const [referred, setReferred] = useState(null); // 'yes' | 'no' | null
	const [selectedAmbassador, setSelectedAmbassador] = useState(null);

	// User Agreement Stuff
	const [privacyAccepted, setPrivacyAccepted] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);

	useEffect(() => {
		setLoadingAmbassadors(true);
		api
			.get("/ambassadors")
			.then((res) => {
				setAmbassadors(res.data);
			})
			.catch((err) => {
				console.error("Failed to fetch ambassadors", err);
				setAmbassadorError("Could not load ambassador list");
			})
			.finally(() => setLoadingAmbassadors(false));
	}, []);

	// 3) bottom sheet ref
	const ambassadorSheetRef = useRef(null);
	const openAmbassadorSheet = () => {
		Keyboard.dismiss();
		ambassadorSheetRef.current?.expand();
	};
	const closeAmbassadorSheet = () => {
		ambassadorSheetRef.current?.close();
	};

	console.log("Ambassadors:", ambassadors);

	const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

	const handleChange = (key, value) => {
		setForm((prev) => ({ ...prev, [key]: value }));
		setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	function validateSignupForm({
		first_name,
		last_name,
		username,
		email,
		password,
		password_confirmation,
	}) {
		const errors = {};

		// Required fields
		if (!first_name.trim()) errors.first_name = ["is required."];
		if (!last_name.trim()) errors.last_name = ["is required."];
		if (!username.trim()) errors.username = ["is required."];
		if (!email.trim()) errors.email = ["is required."];
		if (!password.trim()) errors.password = ["is required."];
		if (!password_confirmation.trim())
			errors.password_confirmation = ["is required."];

		// Username format (if provided)
		const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]{2,19}$/;
		if (username && !usernameRegex.test(username)) {
			errors.username = errors.username || [];
			errors.username.push(
				"must be 3–20 characters, use letters/numbers/underscores only, and start with a letter or underscore."
			);
		}

		// Password format (if provided)
		const passwordRegex = /^[^\s]{8,}$/;
		if (password && !passwordRegex.test(password)) {
			errors.password = errors.password || [];
			errors.password.push("must be at least 8 characters with no spaces.");
		}

		// Password confirmation match
		if (
			password &&
			password_confirmation &&
			password !== password_confirmation
		) {
			errors.password_confirmation = errors.password_confirmation || [];
			errors.password_confirmation.push("does not match the password.");
		}

		return errors;
	}

	const handleSignup = async () => {
		setFieldErrors({});

		const validationErrors = validateSignupForm(form);
		const hasMissingRequiredFields = Object.values(validationErrors).some(
			(arr) => arr.includes("is required.")
		);

		if (hasMissingRequiredFields) {
			setFieldErrors(validationErrors);
			return;
		}

		setSignupDisabled(true); // ⛔ temporarily disable the button

		setTimeout(() => setSignupDisabled(false), 3000); // ✅ re-enable in 3 seconds

		try {
			await api.post("/signup", {
				user: {
					...form,
					favorite_team_id: favoriteTeamId,
					ambassador:
						referred === "yes" && selectedAmbassador
							? selectedAmbassador.value
							: null,
				},
			});
			showSuccess("Account created!");

			await handleLogin(form.email, form.password);
		} catch (err) {
			console.error("Signup failed", err?.response?.data || err.message);
			const errors = err?.response?.data?.errors;

			if (errors) {
				setFieldErrors((prev) => {
					const merged = { ...prev };
					for (const [key, value] of Object.entries(errors)) {
						merged[key] = [...(merged[key] || []), ...value];
					}
					return merged;
				});
			} else {
				showError("Signup failed. Please check your input.");
			}
		}
	};

	const handleLogin = async (email, password) => {
		try {
			const response = await fetch(`${API_BASE_URL}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user: { email, password } }),
			});

			const responseText = await response.text();

			if (response.ok) {
				const data = JSON.parse(responseText);
				if (data.token) {
					await login(data.token); // from AuthContext
					router.replace("/emailConfirmation");
				} else {
					showError("Login failed: Token missing.");
				}
			} else {
				showError("Login failed. Please check your credentials.");
			}
		} catch (error) {
			console.error("Login error:", error.message);
			showError("Login error. Please try again.");
		}
	};

	return (
		<SafeAreaProvider>
				<SafeAreaView style={s.container}>
					<KeyboardAwareScrollView
						contentContainerStyle={s.innerContainer}
						extraScrollHeight={60} // tweak this if needed
						enableOnAndroid={true}
						keyboardShouldPersistTaps="handled"
						keyboardDismissMode="on-drag" 
					>
						<Txt style={s.title}>Create Account</Txt>

						<View style={s.nameContainer}>
							<View style={s.nameElement}>
								<Txt>First Name</Txt>
								<TextInput
									placeholder="First Name"
									placeholderTextColor="#B8C3CC"
									autoCapitalize="words"
									style={s.input}
									value={form.first_name}
									onChangeText={(val) => handleChange("first_name", val)}
									autoCorrect={false} // 🚫 Disable autocorrect
									spellCheck={false}
								/>
								{fieldErrors.first_name && (
									<Txt style={s.inlineError}>
										First name {fieldErrors.first_name.join(", ")}
									</Txt>
								)}
							</View>

							<View style={s.nameElement}>
								<Txt style={s.formTxt}>Last Name</Txt>
								<TextInput
									placeholder="Last Name"
									placeholderTextColor="#B8C3CC"
									autoCapitalize="words"
									style={s.input}
									value={form.last_name}
									onChangeText={(val) => handleChange("last_name", val)}
									autoCorrect={false} // 🚫 Disable autocorrect
									spellCheck={false}
								/>
								{fieldErrors.last_name && (
									<Txt style={s.inlineError}>
										Last name {fieldErrors.last_name.join(", ")}
									</Txt>
								)}
							</View>
						</View>

						<Txt>Username</Txt>
						<TextInput
							placeholder="Username"
							placeholderTextColor="#B8C3CC"
							style={s.input}
							value={form.username}
							onChangeText={(val) => handleChange("username", val)}
							autoCapitalize="none"
							autoCorrect={false} // 🚫 Disable autocorrect
							spellCheck={false}
						/>
						{fieldErrors.username && (
							<Txt style={s.inlineError}>
								Username {fieldErrors.username.join(", ")}
							</Txt>
						)}

						<Txt>Email</Txt>
						<TextInput
							placeholder="Email"
							placeholderTextColor="#B8C3CC"
							style={s.input}
							value={form.email}
							onChangeText={(val) => handleChange("email", val)}
							autoCapitalize="none"
							keyboardType="email-address"
							autoCorrect={false} // 🚫 Disable autocorrect
							spellCheck={false}
						/>
						{fieldErrors.email && (
							<Txt style={s.inlineError}>
								Email {fieldErrors.email.join(", ")}
							</Txt>
						)}

						<Txt>Password</Txt>
						<TextInput
							placeholder="Password"
							placeholderTextColor="#B8C3CC"
							style={s.input}
							secureTextEntry
							value={form.password}
							onChangeText={(val) => handleChange("password", val)}
						/>
						{fieldErrors.password && (
							<Txt style={s.inlineError}>
								Password {fieldErrors.password.join(", ")}
							</Txt>
						)}

						<Txt>Confirm Password</Txt>
						<TextInput
							placeholder="Confirm Password"
							placeholderTextColor="#B8C3CC"
							style={s.input}
							secureTextEntry
							value={form.password_confirmation}
							onChangeText={(val) => handleChange("password_confirmation", val)}
						/>
						{fieldErrors.password_confirmation && (
							<Txt style={s.inlineError}>
								Password confirmation{" "}
								{fieldErrors.password_confirmation.join(", ")}
							</Txt>
						)}

						<Txt>Favorite Team</Txt>
						<TouchableOpacity style={s.selector} onPress={openTeamSheet}>
							<View style={s.selectorView}>
								<Txt style={s.selectorTxt}>
									{favoriteTeamId
										? teams.find((t) => t.id === favoriteTeamId)?.name
										: "None"}
								</Txt>
								<FontAwesome6 name="chevron-down" size={16} color={"#F8F8F8"} />
							</View>
						</TouchableOpacity>

						<Txt>Did a Battle Bets ambassador refer you?</Txt>
						<View style={s.radioRow}>
							<TouchableOpacity
								onPress={() => {
									setReferred("yes");
								}}
							>
								<View style={s.radioOption}>
									<View
										style={[
											s.radioCircle,
											// referred === "no" && s.radioSelected,
										]}
									>
										<View style={referred === "yes" && s.radioSelected} />
									</View>
									<Txt>Yes</Txt>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => {
									setReferred("no");
									setSelectedAmbassador(null);
								}}
							>
								<View style={s.radioOption}>
									<View
										style={[
											s.radioCircle,
											// referred === "no" && s.radioSelected,
										]}
									>
										<View style={referred === "no" && s.radioSelected} />
									</View>
									<Txt>No</Txt>
								</View>
							</TouchableOpacity>
						</View>

						{referred === "yes" && (
							<>
								{loadingAmbassadors ? (
									<Txt>Loading ambassadors…</Txt>
								) : ambassadorError ? (
									<Txt style={{ color: "red" }}>{ambassadorError}</Txt>
								) : (
									<TouchableOpacity
										style={s.selector}
										onPress={openAmbassadorSheet}
									>
										<View style={s.selectorView}>
											<Txt
												style={s.selectorTxt}
												numberOfLines={1}
												ellipsizeMode="tail"
											>
												{selectedAmbassador?.label || "Select ambassador"}
											</Txt>
											<FontAwesome6
												name="chevron-down"
												size={16}
												color="#F8F8F8"
											/>
										</View>
									</TouchableOpacity>
								)}
							</>
						)}

						<UserAgreement
							privacyAccepted={privacyAccepted}
							setPrivacyAccepted={setPrivacyAccepted}
							termsAccepted={termsAccepted}
							setTermsAccepted={setTermsAccepted}
						/>

						<Btn
							btnText={signupDisabled ? "Processing..." : "Create Account"}
							onPress={handleSignup}
							isEnabled={!signupDisabled && privacyAccepted && termsAccepted}
							style={s.submitButton}
						/>
						<TouchableOpacity
							style={s.loginContainer}
							onPress={() => router.back()}
						>
							<Txt style={s.loginTxt}>Back to Login</Txt>
						</TouchableOpacity>
					</KeyboardAwareScrollView>

					<FaveTeamBottomSheet
						loading={loading}
						teams={teams}
						favoriteTeamId={favoriteTeamId}
						setFavoriteTeamId={setFavoriteTeamId}
						sheetRef={sheetRef}
						closeTeamSheet={closeTeamSheet}
					/>
					<BottomSheet
						ref={ambassadorSheetRef}
						index={-1}
						snapPoints={["50%"]}
						enablePanDownToClose
						onClose={closeAmbassadorSheet}
						backgroundStyle={s.sheetBackground}
						handleIndicatorStyle={s.handle}
					>
						<BottomSheetScrollView contentContainerStyle={s.sheetContent}>
							{ambassadors.map((amb) => (
								<TouchableOpacity
									key={amb.value}
									style={[
										s.ambassadorItem,
										selectedAmbassador?.value === amb.value &&
											s.ambassadorSelected,
									]}
									onPress={() => {
										setSelectedAmbassador(amb);
										closeAmbassadorSheet();
									}}
								>
									<Txt>{amb.label}</Txt>
								</TouchableOpacity>
							))}
						</BottomSheetScrollView>
					</BottomSheet>
				</SafeAreaView>
		</SafeAreaProvider>
	);
}

const s = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#061826",
	},
	innerContainer: {
		padding: 16,
	},
	title: {
		fontSize: 24,
		color: "#F8F8F8",
		marginBottom: 16,
	},
	nameContainer: {
		flexDirection: "row",
		gap: 8,
	},
	nameElement: {
		flex: 1,
	},
	formTxt: {
		// fontFamily: "Saira_600SemiBold",
	},
	input: {
		fontFamily: "Saira_600SemiBold",
		height: 48,
		// backgroundColor: "#F8F8F8",
		borderColor: "#3A454D",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
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
	selector: {
		// backgroundColor: "#DAE1E5",
		borderWidth: 1,
		borderColor: "#3A454D",
		borderRadius: 8,
		padding: 12,
		marginBottom: 12,
	},
	selectorTxt: {
		fontFamily: "Saira_600SemiBold",
		color: "#F8F8F8",
		fontSize: 14,
		flexShrink: 1,
	},
	selectorView: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},

	// Referral Styles
	radioRow: {
		flexDirection: "row",
		// marginBottom: 12,
		gap: 48,
	},
	radioOption: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		paddingTop: 4,
		paddingBottom: 12,
	},
	radioCircle: {
		width: 20,
		height: 20,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#F8F8F8",
		alignItems: "center",
		justifyContent: "center",
	},
	radioSelected: {
		width: 10,
		height: 10,
		borderRadius: 20,
		backgroundColor: "#F8F8F8",
		// borderColor: "#54D18C",
	},

	// Referral Bottom Sheet
	sheetBackground: { backgroundColor: "#0F2638" },
	handle: {
		backgroundColor: "#F8F8F8",
	},
	sheetContent: {
		padding: 16,
	},
	ambassadorItem: {
		paddingVertical: 12,
		paddingHorizontal: 8,
		borderBottomWidth: 0.5,
		borderColor: "#284357",
	},
	ambassadorSelected: {
		backgroundColor: "#1D394E",
		borderRadius: 8,
	},

	submitButton: {
		marginTop: 16,
		paddingVertical: 12,
	},
	loginContainer: {
		paddingVertical: 20,
		alignItems: "center",
	},
	loginTxt: {
		// color: "#B8C3CC",
	},
});
