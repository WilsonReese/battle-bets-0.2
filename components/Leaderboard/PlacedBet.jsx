import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BetDetails } from "../BetSlip/BetDetails";
import { BetAmount } from "../BetSlip/BetAmount";

export function PlacedBet({ bet }) {
  // Define outcome variables based on bet status
  const isPending = bet.bet_option.success === null;
  const isFailed = bet.bet_option.success === false;
  const isSuccess = bet.bet_option.success === true;

  // Define colors based on outcome
  const betNameColor = isPending ? "#F8F8F8" : isFailed ? "#8E9AA4" : "#F8F8F8";
  const payoutColor = isPending ? "#F8F8F8" : isFailed ? "#8E9AA4" : "#54D18C";
  const textColor = isPending ? "#F8F8F8" : isFailed ? "#8E9AA4" : "#54D18C";
  const textStyle = isPending ? "Saira_400Regular" : isFailed ? "Saira_400Regular" : "Saira_600SemiBold";

  const matchup = `${bet.bet_option.game.away_team.name} at ${bet.bet_option.game.home_team.name}`

  return (
    <View style={s.container}>
      <View style={[s.betContainer]}>
        <View style={s.betNameContainer}>
          <BetDetails name={bet.bet_option.title} matchup={matchup} multiplier={bet.bet_option.payout} betNameColor={betNameColor} payoutColor={payoutColor}/>
        </View>
        <View style={s.betAmountContainer}>
          {isPending && <BetAmount betAmount={Math.round(bet.bet_amount)} toWinAmount={Math.round(bet.to_win_amount)}/>}
          {!isPending && (
            <Txt style={[s.txt, { color: textColor, fontFamily: textStyle }]}>
              Won ${Math.round(bet.amount_won)}
            </Txt>
          )}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    
  },
  betContainer: {
    paddingHorizontal: 8,
    borderRadius: 8,
    paddingVertical: 4,
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: '#0F2638'
  },
  iconContainer: {
    flex: 0.5,
    justifyContent: "center",
  },
  betNameContainer: {
    flex: 3,
    // paddingHorizontal: 4,
  },
  betAmountContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  txt: {
    color: "#061826",
    fontSize: 14,
  },
});
