import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function PoolCard({ pool }) {
  return (
    <View style={s.card}>
      <Txt style={s.heading}>{pool.name}</Txt>
      <View style={s.leagueOverviewContainer}>
        <View>
          <Txt style={s.txt}>25 points</Txt>
          <Txt style={s.txt}>4th place</Txt>
        </View>
        <View>
          <Txt>Button Go to League</Txt>
        </View>
      </View>
      <View style={s.horizontalLine}/>
      <View>
        <Txt style={s.heading}>Current Battle</Txt>
        {/* THIS SECTION WILL NEED TO BE DYNAMIC DEPENDING ON BETSLIP STATUS */}
        <View style={s.currentBattleContainer}>
          <View>
            <Txt style={s.txt}>Make bets before games start</Txt>
            <Txt style={s.txt}>0/12 betslips submitted</Txt>
          </View>
          <View>
            <Txt>Make Bets</Txt>
          </View>
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heading: {
    color: "#061826",
    fontFamily: "Saira_600SemiBold",
    paddingVertical: 4,
    // fontSize: 18,
  },
  txt: {
    color: "#061826",
  },
  leagueOverviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#F8F8F8",
    alignSelf: 'stretch',
    marginVertical: 4,
    // width: 100,
  },
  currentBattleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
});
