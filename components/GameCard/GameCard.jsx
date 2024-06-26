import { StyleSheet, View } from "react-native";
import { Datetime } from "./Datetime/Datetime";
import { Matchup } from "./Matchup/Matchup";
import { BetOptions } from "./BetOptions";
import { Txt } from "../general/Txt";

export function GameCard({ game, budget, setBudget, totalBet, setTotalBet }) {
  const {
    date,
    time,
    homeTeam,
    awayTeam,
    homeRecord,
    awayRecord,
    ou,
    ouPayout,
    spreadHome,
    spreadAway,
    spreadPayout,
    moneyLineHome,
    moneyLineHomePayout,
    moneyLineAway,
    moneyLineAwayPayout,
  } = game;

  return (
    // Game Card
    <View style={s.card}>
      <View style={s.gameDetails}>
        <Datetime date={date} time={time} />
        <Txt style={{ fontSize: 12, color: "black" }}>Collapisble Arrow</Txt>
      </View>
      <View>
        <Matchup
          homeTeam={homeTeam}
          homeRecord={homeRecord}
          awayTeam={awayTeam}
          awayRecord={awayRecord}
        />
        <BetOptions
          spreadHome={spreadHome}
          spreadAway={spreadAway}
          ou={ou}
          spreadPayout={spreadPayout}
          ouPayout={ouPayout}
          budget={budget}
          setBudget={setBudget}
          totalBet={totalBet}
          setTotalBet={setTotalBet}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#DAE1E5",
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gameDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
