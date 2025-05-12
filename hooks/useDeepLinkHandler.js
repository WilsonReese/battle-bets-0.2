import * as Linking from "expo-linking";
import { useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import api from "@/utils/axiosConfig";
import { AuthContext } from "../components/contexts/AuthContext";
import { useToastMessage } from "./useToastMessage";

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
          // User not logged in – redirect to login with intent
          router.replace({
            pathname: "/login",
            params: {
              redirect: "join",
              pool_id,
              token,
            },
          });
          return;
        }

        try {
          router.replace('/pools/');
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
