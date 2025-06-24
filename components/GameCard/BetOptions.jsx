import { StyleSheet, View } from "react-native";
import { Spread } from "./Spread/Spread";
import { OverUnder } from "./OverUnder/OverUnder";
import { Txt } from "../general/Txt";
import { MoneyLine } from "./MoneyLine";
import { PropBets } from "./PropBets";
import {  useBets } from "../contexts/BetContext";

// I will eventually want to change this so that the enum for bet type
// passes only what we need
export function BetOptions({ game }) {

  const { betOptionType } = useBets(); // Use the context
  // console.log("BetOptionType:", betOptionType)

  const spreadOptions = game.bet_options.filter(
    (option) => option.category === "spread"
  );

  console.log('Spread Options:', spreadOptions)

  const ouOptions = game.bet_options.filter(
    (option) => option.category === "ou"
  );

  const moneyLineOptions = game.bet_options.filter(
    (option) => option.category === "money_line"
  );

  const propBetOptions = game.bet_options.filter(
    (option) => option.category === "prop"
  );

  return (
    <View style={s.container}>
      {betOptionType === "spreadOU" && (
        <View>
          <Spread
            spreadOptions={spreadOptions}
            game={game}
            homeTeam={game.home_team.name}
            awayTeam={game.away_team.name}
            // spreadHome={game.spreadHome}
            // spreadAway={game.spreadAway}
            // spreadPayout={game.spreadPayout}
          />
          <OverUnder
            ouOptions={ouOptions}
            game={game}
            // ou={game.ou}
            // ouPayout={game.ouPayout}
            homeTeam={game.home_team.name}
            awayTeam={game.away_team.name}
          />
        </View>
      )}
      {betOptionType === "moneyLine" && (
        <View>
          <MoneyLine
            moneyLineOptions={moneyLineOptions}
            game={game}
            homeTeam={game.home_team.name}
            awayTeam={game.away_team.name}
            moneyLineHome={game.moneyLineHome}
            moneyLineHomePayout={game.moneyLineHomePayout}
            moneyLineAway={game.moneyLineAway}
            moneyLineAwayPayout={game.moneyLineAwayPayout}
          />
        </View>
      )}
      {betOptionType === "prop" && (
        <PropBets
          betOptions={propBetOptions}
          game={game}
          homeTeam={game.home_team.name}
          awayTeam={game.away_team.name}
        />
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
