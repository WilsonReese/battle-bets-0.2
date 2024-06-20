import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Datetime } from "./Datetime/Datetime";

export function GameCard({ game }) {
  const {
    date,
    time,
    homeTeam,
    awayTeam,
    homeRecord,
    awayRecord,
    ou,
    spreadHome,
    spreadAway,
    moneyLineHome,
    moneyLineAway,
  } = game;

  return (
    // Game Card
    <View style={s.card}>
      <View style={s.gameDetails}>
        <Datetime date={date} time={time} />
        <Txt style={{fontSize: 12}}>Collapisble Arrow</Txt>
      </View>
      <View>
        <Txt>
          {homeTeam} {homeRecord} vs {awayTeam} {awayRecord}
        </Txt>
        <View>
          <Txt>{spreadHome} Component</Txt>
          <Txt>{spreadAway} Component</Txt>
          <Txt>Over/Under: {ou}</Txt>
        </View>
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
    paddingTop: 4,
    paddingBottom: 4,
  },
  gameDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
