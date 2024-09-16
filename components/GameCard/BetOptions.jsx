import { StyleSheet, View } from "react-native";
import { Spread } from "./Spread/Spread";
import { OverUnder } from "./OverUnder/OverUnder";
import { useBetContext } from "../contexts/BetContext";
import { Txt } from "../general/Txt";
import { MoneyLine } from "./MoneyLine";
import { PropBets } from "./PropBets";

// I will eventually want to change this so that the enum for bet type
// passes only what we need
export function BetOptions({ game }) {
  const { betOptionType } = useBetContext(); // Use the context

  const spreadOptions = game.bet_options.filter(
    (option) => option.category === "spread"
  );

  return (
    <View style={s.container}>
      {betOptionType === "spreadOU" && (
        <View>
          <Spread
            spreadOptions={spreadOptions}
            spreadHome={game.spreadHome}
            spreadAway={game.spreadAway}
            spreadPayout={game.spreadPayout}
          />
          <OverUnder ou={game.ou} ouPayout={game.ouPayout} homeTeam={game.homeTeam} awayTeam={game.awayTeam}/>
        </View>
      )}
      {betOptionType === "moneyLine" && (
        <View>
          <MoneyLine
            moneyLineHome={game.moneyLineHome}
            moneyLineHomePayout={game.moneyLineHomePayout}
            moneyLineAway={game.moneyLineAway}
            moneyLineAwayPayout={game.moneyLineAwayPayout}
          />
        </View>
      )}
      {betOptionType === "prop" && (
        <PropBets betOptions={game.props}/>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // borderWidth: 1,
    paddingTop: 4,
  },
});
