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

export default function GameDetails() {
  const { selectedGame, selectedGameData } = useScoreboard();
  const awayTeam = selectedGame.away_team;
  const homeTeam = selectedGame.home_team;

  // Box Score or Bets Toggle
  const [infoMode, setInfoMode] = useState("boxScore"); 

  // Selected Team for Box Score Toggle
  const [selectedTeam, setSelectedTeam] = useState(awayTeam.name);


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
              <View style={{alignItems: 'center'}}>
                <DataToggle
                  optionLeft={awayTeam.name}
                  optionRight={homeTeam.name}
                  selected={selectedTeam}
                  onSelect={setSelectedTeam}
                />
              </View>
              <Txt>Box Score Details</Txt>
              <Txt>Toggle Teams</Txt>
              <Txt>Team Stats</Txt>
              <Txt>Passing</Txt>
              <Txt>Rushing</Txt>
              <Txt>Receiving</Txt>
            </>
          )}

          {infoMode === "bets" && (
            <>
              <DataToggle
                optionLeft={"Your Bets"}
                optionRight={"League Bets"}
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
