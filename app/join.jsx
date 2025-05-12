import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useContext } from "react";
import { AuthContext } from "../components/contexts/AuthContext";
import api from "../utils/axiosConfig";
import { useToastMessage } from "../hooks/useToastMessage";

export default function JoinScreen() {
  const { pool_id, token } = useLocalSearchParams();
  const { token: authToken } = useContext(AuthContext);
  const { showSuccess, showError } = useToastMessage();
  const router = useRouter();

  useEffect(() => {
    if (!pool_id || !token) {
      showError("Missing invitation data.");
      return;
    }

    if (!authToken) {
      router.replace({
        pathname: "/login",
        params: { redirect: "join", pool_id, token },
      });
      return;
    }

    const joinLeague = async () => {
      try {
        await api.post(`/pools/${pool_id}/pool_memberships`, {
          pool_membership: { token },
        });
        showSuccess("Successfully joined league.");
        router.replace(`/pools/${pool_id}`);
      } catch (error) {
        console.error("Join failed:", error);
        showError("Failed to join league.");
        router.replace("/pools");
      }
    };

    joinLeague();
  }, [authToken]);

  return null; // Or a loading spinner if you want
}
