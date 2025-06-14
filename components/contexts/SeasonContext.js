import { createContext, useContext, useEffect, useState } from "react";
import api from "../../utils/axiosConfig";

const SeasonContext = createContext();

export const SeasonProvider = ({ children }) => {
  const [currentSeason, setCurrentSeason] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentSeason = async () => {
      try {
        const res = await api.get("/seasons", { params: { limit: 1 } });
        setCurrentSeason(res.data);
      } catch (error) {
        console.error("Failed to load current season", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentSeason();
  }, []);

  return (
    <SeasonContext.Provider value={{ currentSeason, loading }}>
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => useContext(SeasonContext);