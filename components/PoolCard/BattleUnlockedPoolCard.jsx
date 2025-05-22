import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { router } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export function BattleUnlockedPoolCard({ pool, userEntry }) {
  return (
    <View style={s.detailsContainer}>
      <View style={s.overviewContainer}>
        <View style={s.headingTxtContainer}>
          <Txt style={s.sectonHeadingTxt}>Season</Txt>
        </View>
        <View style={s.infoContainer}>
          <View style={s.infoUnitContainer}>
            <Txt style={s.infoTitleTxt}>Rank:</Txt>
            <Txt style={s.txt}>{userEntry?.ranking || "N/A"}</Txt>
          </View>
          <View style={s.infoUnitContainer}>
            <Txt style={s.infoTitleTxt}>Points:</Txt>
            <Txt style={s.txt}>{userEntry?.total_points || "N/A"}</Txt>
          </View>
        </View>
        {/* <View>
          <Btn
            btnText={`Go to ${pool.name}`}
            style={s.btn}
            isEnabled={true}
            fontSize={14}
            onPress={() => router.push(`/pools/${pool.id}/`)}
          />
        </View> */}
      </View>

      <View style={s.currentBattleContainer}>
        <View style={s.headingTxtContainer}>
          <Txt style={s.sectonHeadingTxt}>This Week</Txt>
        </View>
        <View style={s.infoContainer}>
          <View style={s.infoUnitContainer}>
            <Txt style={s.infoTitleTxt}>League Participation:</Txt>
            <Txt style={s.txt}>0%</Txt>
          </View>
          <TouchableOpacity style={s.infoUnitContainer}>
            <Txt style={s.infoTitleTxt}>My Betslip:</Txt>
            <Txt style={s.txt}>$4500 to bet</Txt>
            <FontAwesome6 name="pen-to-square" size={14} color="#54D18C" />
          </TouchableOpacity>
        </View>
        {/* <View>
          <Btn
            btnText={`Go to ${pool.name}`}
            style={s.btn}
            isEnabled={true}
            fontSize={14}
            onPress={() => router.push(`/pools/${pool.id}/`)}
          />
        </View> */}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  detailsContainer: {
    flexDirection: "row",
    paddingBottom: 4,
    gap: 8,
  },
  overviewContainer: {
    flex: 3,
  },
  currentBattleContainer: {
    flex: 6,
  },

  infoContainer: {
    paddingVertical: 4,
  },

  infoUnitContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: 'center',
  },

  infoTitleTxt: {
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },

  sectonHeadingTxt: {
    // color: "#061826",
    // fontFamily: "Saira_300Light",
    letterSpacing: 2,
    fontSize: 12,
    textTransform: "uppercase",
    color: "#B8C3CC",
  },

  txt: {
    // color: "#061826",
    fontSize: 14,
  },

  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    // margin: 4,
  },
});
