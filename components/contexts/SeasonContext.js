import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../../utils/axiosConfig";

const SeasonContext = createContext();

export const SeasonProvider = ({ children }) => {
  const [currentSeason, setCurrentSeason] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * @param {{ silent?: boolean }} opts 
   *    silent: true → don't toggle `loading`
   */
  const fetchCurrentSeason = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      try {
        const res = await api.get("/seasons", { params: { limit: 1 } });
        setCurrentSeason(res.data);
      } catch (error) {
        console.error("Failed to load current season", error);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    []
  );

  // initial load (non‑silent)
  useEffect(() => {
    fetchCurrentSeason();
  }, [fetchCurrentSeason]);

  return (
    <SeasonContext.Provider
      value={{
        currentSeason,
        loading,
        refresh: (opts) => fetchCurrentSeason(opts), // expose with opts
      }}
    >
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => useContext(SeasonContext);