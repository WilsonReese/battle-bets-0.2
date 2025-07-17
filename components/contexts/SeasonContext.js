import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	useMemo,
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
	const fetchCurrentSeason = useCallback(async ({ silent = false } = {}) => {
		if (!silent) setLoading(true);
		try {
			const res = await api.get("/seasons", { params: { limit: 1 } });
			setCurrentSeason(res.data);
			return res.data; // ← return the actual season
		} catch (error) {
			console.error("Failed to load current season", error);
		} finally {
			if (!silent) setLoading(false);
		}
	}, []);

	// initial load (non‑silent)
	useEffect(() => {
		fetchCurrentSeason();
	}, [fetchCurrentSeason]);

	const value = useMemo(
		() => ({
			currentSeason,
			loading,
			refresh: fetchCurrentSeason, // direct, stable reference
		}),
		[currentSeason, loading, fetchCurrentSeason]
	);

	return (
		<SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>
	);
};

export const useSeason = () => useContext(SeasonContext);
