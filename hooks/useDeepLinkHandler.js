import * as Linking from "expo-linking";
import { useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import api from "@/utils/axiosConfig";
import { AuthContext } from "../components/contexts/AuthContext";
import { useToastMessage } from "./useToastMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useDeepLinkHandler = () => {
	const router = useRouter();
	const { token, currentUserId } = useContext(AuthContext);
	const { showSuccess, showError } = useToastMessage();

	useEffect(() => {
		const handleUrl = async ({ url }) => {
			const { queryParams, path } = Linking.parse(url);

			if (path === "join" && queryParams.pool_id && queryParams.token) {
				const { pool_id, token: invite_token } = queryParams;

				if (!token) {
					await AsyncStorage.setItem(
						"pendingJoin",
						JSON.stringify({ pool_id, invite_token })
					);
					console.log("🔗 Saved pending join to AsyncStorage");
					router.replace({
						pathname: "/login",
						params: {
							redirect: "join",
						},
					});
					return;
				}

				try {
					router.replace("/pools/");
					await api.post(`/pools/${pool_id}/pool_memberships`, {
						user_id: currentUserId,
						invite_token,
					});

					router.replace(`/pools/${pool_id}`);
					showSuccess("Joined league successfully!");
				} catch (error) {
					router.replace("/pools/");
					showError("Error joining league.");
				}
			}
		};

		const subscription = Linking.addEventListener("url", handleUrl);
		// Also handle cold-start (first open)
		Linking.getInitialURL().then((url) => {
			if (url) handleUrl({ url });
		});

		return () => subscription.remove();
	}, [token, currentUserId]);
};
