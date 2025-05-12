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
          // not logged in — you can store the invite params in state and redirect post-login
          router.replace("/login");
          return;
        }

        try {
          await api.post(`/pools/${pool_id}/pool_memberships`, {
            user_id: currentUserId,
            invite_token,
          });

          router.replace(`/pools/${pool_id}`);
          showSuccess("Joined league successfully!")
        } catch (error) {
          router.replace('/pools/');
          showError("Error joining league.");
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleUrl);
    return () => subscription.remove();
  }, [token, currentUserId]);
};
