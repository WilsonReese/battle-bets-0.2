import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { TeamLogo } from "../Matchup/TeamLogo";

export function BoxScoreGameCard({ game, gameData, status }) {
  // Placeholder data for the in progress game data
  const quarter = "4th";
  const timeRemaining = "9:32";
  const down = "3rd";
  const distance = "10";
  const possession = "away";
  const yardLine = 25;
  const yardLineTerritory = "KSU";

  // I already have this passed as status
  const statusAPI = gameData.game.status.long;

  const homeScore = gameData.scores.home.total;
  const awayScore = gameData.scores.away.total;
  const isFinal = statusAPI === "Finished";

  const homeWon = homeScore > awayScore;
  const awayWon = awayScore > homeScore;

  const getScoreStyle = (won) => [
    s.scoreElement,
    isFinal && won && status === "Finished" && s.winningScoreTxt,
    isFinal && !won && status === "Finished" && s.losingTxt,
  ];

  const getTeamTxtStyle = (won) => [
    s.teamTxt,
    isFinal && won && status === "Finished" && s.winningTeamTxt,
    isFinal && !won && status === "Finished" && s.losingTxt,
  ];

  return (
    <View style={s.container}>
      {/* Away Team */}
      <View style={s.teamContainer}>
        <Txt style={getScoreStyle(awayWon)}>{awayScore}</Txt>
        <View style={s.teamNameAndLogo}>
          <Txt style={getTeamTxtStyle(awayWon)}>{game.away_team.name}</Txt>
          <TeamLogo teamName={game.away_team.name} size={24} />
        </View>
      </View>

      {/* Game Status */}
      {/* In Progress */}
      {status === "inProgress" && (
        <View style={s.inProgressContainer}>
          <View style={s.fieldPositionContainer}>
            <View style={[s.downAndDistance, {marginBottom: -4}]}>
              <View style={s.iconWrapper}>
                {possession === "away" ? (
                  <FontAwesome6 name="football" size={8} color="#54D18C" />
                ) : (
                  <View style={s.iconPlaceholder} />
                )}
              </View>
              <Txt style={s.downAndDistanceTxt}>
                {down} and {distance}
              </Txt>
              <View style={s.iconWrapper}>
                {possession === "home" ? (
                  <FontAwesome6 name="football" size={8} color="#54D18C" />
                ) : (
                  <View style={s.iconPlaceholder} />
                )}
              </View>
            </View>
            <Txt style={s.yardLineTxt}>
              {yardLineTerritory} {yardLine}
            </Txt>
          </View>
          <View style={s.quarterAndTime}>
            <Txt style={[s.detailsTxt, { marginBottom: -4 }]}>{quarter}</Txt>
            <Txt style={s.detailsTxt}>{timeRemaining}</Txt>
          </View>
        </View>
      )}

      {status === "Finished" && (
        <View style={s.statusContainer}>
          <View style={s.iconWrapper}>
            {awayWon ? (
              <FontAwesome6 name="caret-left" size={12} color="#54D18C" />
            ) : (
              <View style={s.iconPlaceholder} />
            )}
          </View>

          {status === "Finished" && <Txt style={s.statusTxt}>Final</Txt>}

          <View style={s.iconWrapper}>
            {homeWon ? (
              <FontAwesome6 name="caret-right" size={12} color="#54D18C" />
            ) : (
              <View style={s.iconPlaceholder} />
            )}
          </View>
        </View>
      )}

      {/* Home Team */}
      <View style={s.teamContainer}>
        <Txt style={getScoreStyle(homeWon)}>{homeScore}</Txt>
        <View style={s.teamNameAndLogo}>
          <TeamLogo teamName={game.home_team.name} size={24} />
          <Txt style={getTeamTxtStyle(homeWon)}>{game.home_team.name}</Txt>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingBottom: 4,
  },

  // Team Styles
  teamContainer: {
    flex: 1,
    alignItems: "center",
  },
  teamNameAndLogo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  scoreElement: {
    fontSize: 22,
    fontFamily: "Saira_600SemiBold",
  },
  winningScoreTxt: {
    fontFamily: "Saira_800ExtraBold",
  },
  teamTxt: {
    fontSize: 14,
  },
  winningTeamTxt: {
    fontFamily: "Saira_600SemiBold",
  },
  losingTxt: {
    color: "#C7CDD1",
  },

  // Status Styles
  statusContainer: {
    margin: -8,
    zIndex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    // backgroundColor: "red",
  },
  statusTxt: {
    fontSize: 14,
    fontFamily: "Saira_600SemiBold",
  },
  iconWrapper: {
    width: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPlaceholder: {
    width: 12,
    height: 12,
  },

  inProgressContainer: {
    alignItems: "center",
    margin: -16,
    zIndex: 1,
    justifyContent: "center",
    // backgroundColor: 'blue'
    paddingTop: 4, // This helps make the time feel aligned in the center of the card vertically
  },
  quarterAndTime: {
    alignItems: "center",
  },
  detailsTxt: {
    fontSize: 12,
    fontFamily: "Saira_600SemiBold",
  },
  downAndDistance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  downAndDistanceTxt: {
    fontSize: 11,
    color: '#C7CDD1'
  },
  fieldPositionContainer: {
    alignItems: 'center',
  },
  yardLineTxt: {
    fontSize: 11,
    color: '#C7CDD1'
  },
});
