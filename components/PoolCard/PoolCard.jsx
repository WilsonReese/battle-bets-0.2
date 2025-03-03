import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { router } from "expo-router";

export function PoolCard({ pool }) {
  return (
    <View style={s.card}>
      <Txt style={s.heading}>{pool.name}</Txt>

      <View style={s.detailsContainer}>
        <View style={s.overviewContainer}>
          <Txt style={s.sectonHeadingTxt}>Overview</Txt>
          <View>
            <Txt style={s.txt}>25 points</Txt>
            <Txt style={s.txt}>Rank 4th</Txt>
          </View>
          <View>
            <Btn
              btnText={`Go to ${pool.name}`}
              style={s.btn}
              isEnabled={true}
              fontSize={14}
              onPress={() => router.push(`/pools/${pool.id}/`)}
            />
          </View>
        </View>

        {/* <View style={s.verticalLine} /> */}

        <View style={s.currentBattleContainer}>
          <Txt style={s.sectonHeadingTxt}>Current Battle</Txt>
          <View>
            <Txt style={s.txt}>0/12 betslips submitted</Txt>
            <Txt style={s.txt}>Make bets before games start</Txt>
          </View>
          <View>
            <Btn
              btnText={`Go to ${pool.name}`}
              style={s.btn}
              isEnabled={true}
              fontSize={14}
              onPress={() => router.push(`/pools/${pool.id}/`)}
            />
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
    paddingVertical: 4,
  },
  heading: {
    color: "#061826",
    fontFamily: "Saira_600SemiBold",
    paddingVertical: 4,
    // fontSize: 18,
  },
  headingsContainer: {
    flexDirection: "row",
  },
  detailsContainer: {
    flexDirection: "row",
    paddingBottom: 8, 
    // justifyContent: 'space-between'
    // alignItems: 
  },
  overviewContainer: {
    flex: 3,
    paddingRight: 4,
  },
  currentBattleContainer: {
    flex: 5,
    paddingLeft: 4,
  },
  verticalLine: {
    width: 1,
    backgroundColor: "#B8C3CC",
    alignSelf: "stretch",
    marginVertical: 8,
  },

  sectonHeadingTxt: {
    color: "#061826",
    fontFamily: "Saira_300Light",
    letterSpacing: 1,
    fontSize: 12,
    textTransform: "uppercase",
  },

  txt: {
    color: "#061826",
    fontSize: 14,
  },

  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    // margin: 4,
  },
});
