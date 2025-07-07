import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import api from "../../utils/axiosConfig";

// Create a context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(null);
	const [currentUserId, setCurrentUserId] = useState(null);
	const [isConfirmed, setIsConfirmed] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

	const decodeToken = (jwt) => {
		try {
			const decoded = jwtDecode(jwt);
			return {
				userId: decoded.sub || decoded.user_id || null,
				confirmed: decoded.confirmed ?? null,
			};
		} catch (err) {
			console.error("Error decoding token:", err);
			return { userId: null, confirmed: null };
		}
	};

	// On component mount, check if there's a token stored
	useEffect(() => {
		const loadToken = async () => {
			const storedToken = await SecureStore.getItemAsync("jwt_token");
			if (storedToken) {
				setToken(storedToken);
				const { userId, confirmed } = decodeToken(storedToken);
				setCurrentUserId(userId);
				setIsConfirmed(confirmed);

				// ✅ Set the Authorization header on app launch
				api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
			}
      setIsAuthLoading(false); // ✅ done loading
		};

		loadToken();
	}, []);

	const login = async (newToken) => {
		await SecureStore.setItemAsync("jwt_token", newToken);
		setToken(newToken);
		api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

		const { userId, confirmed } = decodeToken(newToken);
		setCurrentUserId(userId);
		setIsConfirmed(confirmed);
		console.log("🔑 Logged in user ID:", userId);

		const keys = await AsyncStorage.getAllKeys();
		console.log("🧩 All AsyncStorage keys before clearing:", keys);

		const keysToRemove = keys.filter((key) => key !== "pendingJoin");
		await AsyncStorage.multiRemove(keysToRemove);
	};

	const logout = async () => {
		const keys = await AsyncStorage.getAllKeys();
		console.log("🧩 All AsyncStorage keys before clearing:", keys);

		await AsyncStorage.removeItem("pendingJoin");

		await SecureStore.deleteItemAsync("jwt_token");
		setToken(null);
		setCurrentUserId(null);
	};

	return (
		<AuthContext.Provider
			value={{
				token,
				login,
				logout,
				currentUserId,
				isConfirmed,
        isAuthLoading, // 🆕
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
