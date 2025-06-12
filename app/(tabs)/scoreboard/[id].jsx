import { View, StyleSheet, ScrollView } from "react-native";
import { Txt } from "../../../components/general/Txt";
import { useScoreboard } from "../../../components/contexts/ScoreboardContext";
import { ScoreboardGameCard } from "../../../components/GameCard/Scoreboard/ScoreboardGameCard";
import {
  BoxScoreModeToggle,
  BoxScoreOrBetsToggle,
} from "../../../components/BoxScore/BoxScoreOrBetsToggle";
import { useState } from "react";
import { DataToggle } from "../../../components/BoxScore/DataToggle";
import { TeamData } from "../../../components/BoxScore/TeamData";

export default function GameDetails() {
  const { selectedGame, selectedGameData, selectedHomeTeamStats, selectedAwayTeamStats } = useScoreboard();
  const awayTeam = selectedGame.away_team;
  const homeTeam = selectedGame.home_team;

  // Box Score or Bets Toggle
  const [infoMode, setInfoMode] = useState("boxScore");

  // Selected Team for Box Score Toggle
  const [selectedTeam, setSelectedTeam] = useState(awayTeam.name); // makes it default to the away team being selected

  const [selectedBetGroup, setSelectedBetGroup] = useState("Your Bets");

  return (
    // Macro Game Data
    <View style={s.container}>
      <View style={s.macroGameCard}>
        <ScoreboardGameCard
          game={selectedGame}
          sampleGameData={selectedGameData}
        />
      </View>

      {/* Box Score or Bets Toggle */}
      <View>
        <BoxScoreOrBetsToggle selected={infoMode} onSelect={setInfoMode} />
      </View>

      <ScrollView style={s.scrollView}>
        <View style={s.detailsCard}>
          {infoMode === "boxScore" && (
            <>
              <View style={{ alignItems: "center" }}>
                <DataToggle
                  optionLeft={awayTeam.name}
                  optionRight={homeTeam.name}
                  selected={selectedTeam}
                  onSelect={setSelectedTeam}
                />
              </View>
              {selectedTeam === awayTeam.name && <TeamData stats={selectedAwayTeamStats.statistics}/>}
              {selectedTeam === homeTeam.name && <TeamData stats={selectedHomeTeamStats.statistics}/>}
            </>
          )}

          {infoMode === "bets" && (
            <>
              <DataToggle
                optionLeft={"Your Bets"}
                optionRight={"League Bets"}
                selected={selectedBetGroup}
                onSelect={setSelectedBetGroup}
              />
              <Txt>Betting information needs to be accessed here</Txt>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
    padding: 8,
    // alignItems: 'center'
  },
  macroGameCard: {
    backgroundColor: "#0F2638",
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  detailsCard: {
    backgroundColor: "#0F2638",
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
  },
});
