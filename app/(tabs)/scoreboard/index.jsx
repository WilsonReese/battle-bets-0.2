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

export default function Scoreboard() {
  const { currentSeason, loading: seasonLoading } = useSeason();
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);

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
          games.map((game) => (
            // <View key={game.id} style={s.gameCard}>
            //   <Txt>
            //     {game.away_team.name} at {game.home_team.name}
            //   </Txt>
            // </View>
            <GameCard key={game.id} game={game} type={"scoreboard"} />
          ))
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
