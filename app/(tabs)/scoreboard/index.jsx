import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Txt } from "../../../components/general/Txt";
import api from "../../../utils/axiosConfig";
import { useSeason } from "../../../components/contexts/SeasonContext";
import { useFocusEffect } from "expo-router";
import { LoadingIndicator } from "../../../components/general/LoadingIndicator";
import { GameCard } from "../../../components/GameCard/GameCard";
import { ConferenceFilter } from "../../../components/GameCard/ConferenceFilter";

export default function Scoreboard() {
  const CONFERENCES = ["SEC", "Big 12", "Big Ten", "ACC", "Other"];

  const { currentSeason, loading: seasonLoading } = useSeason();
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [selectedConferences, setSelectedConferences] = useState(CONFERENCES); // default: all selected

  const toggleConference = (conf) => {
    setSelectedConferences((prev) =>
      prev.includes(conf) ? prev.filter((c) => c !== conf) : [...prev, conf]
    );
  };

  const filteredGames = games.filter((game) => {
    const homeConf = game.home_team.conference || "Other";
    const awayConf = game.away_team.conference || "Other";

    return (
      selectedConferences.includes(homeConf) ||
      selectedConferences.includes(awayConf)
    );
  });

  useFocusEffect(
    useCallback(() => {
      const fetchGames = async () => {
        if (!currentSeason) return;

        setLoadingGames(true);

        try {
          const res = await api.get("/games", {
            params: {
              week: currentSeason.current_week,
              season_year: currentSeason.year,
            },
          });

          setGames(res.data);
        } catch (err) {
          console.error("Failed to load games:", err);
        } finally {
          setLoadingGames(false);
        }
      };

      fetchGames();
    }, [currentSeason])
  );

  console.log("Games: ", games);

  if (seasonLoading || loadingGames) {
    return (
      <View style={s.container}>
        <LoadingIndicator color="light" contentToLoad="scoreboard" />
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View>
        <Txt>Conferences Filter</Txt>
      </View>

      {/* Games */}
      <ScrollView>
        {games.length === 0 ? (
          <Txt>No games found for this week.</Txt>
        ) : (
          <>
            <ConferenceFilter
              selected={selectedConferences}
              onToggle={toggleConference}
              conferences={CONFERENCES}
            />
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} type={"scoreboard"} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#061826",
    justifyContent: "center",
    alignItems: "center",
  },
  gameCard: {
    backgroundColor: "#061826",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
});
