import { StyleSheet, View, TouchableOpacity, } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Txt } from "../general/Txt";

export function BattleLockedPoolCard({ userEntry }) {
  return (
    <View style={s.detailsContainer}>
      <View style={s.overviewContainer}>
        <Txt style={s.sectonHeadingTxt}>Season</Txt>
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
      </View>

      <View style={s.currentBattleContainer}>
        <Txt style={s.sectonHeadingTxt}>This Week</Txt>
        <View style={s.infoContainer}>
          <View style={s.infoUnitContainer}>
            <Txt style={s.infoTitleTxt}>Rank</Txt>
            <Txt style={s.txt}>???</Txt>
          </View>
          <TouchableOpacity style={s.infoUnitContainer}>
            <Txt style={s.infoTitleTxt}>Points</Txt>
            <Txt style={s.txt}>Max</Txt>
            <Txt style={s.txt}>View Bets</Txt>
            <FontAwesome6 name="pen-to-square" size={14} color="#54D18C" />
          </TouchableOpacity>
        </View>
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
    flex: 1,
  },
  currentBattleContainer: {
    flex: 2,
  },
  infoContainer: {
    paddingVertical: 4,
  },

  infoUnitContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
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
    fontSize: 14,
  },
});
