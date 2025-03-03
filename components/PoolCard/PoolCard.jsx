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
          <View style={s.headingTxtContainer}>
            <Txt style={s.sectonHeadingTxt}>Overview</Txt>
          </View>
          <View style={s.infoContainer}>
            <View style={s.infoUnitContainer}>
              <Txt style={s.infoTitleTxt}>Points: </Txt>
              <Txt style={s.txt}>25</Txt>
            </View>
            <View style={s.infoUnitContainer}>
              <Txt style={s.infoTitleTxt}>Rank: </Txt>
              <Txt style={s.txt}>4</Txt>
            </View>
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
          <View style={s.headingTxtContainer}>
            <Txt style={s.sectonHeadingTxt}>Current Battle</Txt>
          </View>
          <View style={s.infoContainer}>
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
    fontSize: 18,
  },
  // headingTxtContainer: {
  //   paddingBottom: 2,
  // },
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
  // verticalLine: {
  //   width: 1,
  //   backgroundColor: "#B8C3CC",
  //   alignSelf: "stretch",
  //   marginVertical: 8,
  // },

  infoContainer: {
    paddingVertical: 4, 
  },

  infoUnitContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between'
  },

  infoTitleTxt: {
    color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },

  sectonHeadingTxt: {
    color: "#061826",
    fontFamily: "Saira_300Light",
    letterSpacing: 2,
    fontSize: 14,
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
