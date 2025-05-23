import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { router } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import api from "../../utils/axiosConfig";
import { usePoolDetails } from "../contexts/PoolDetailsContext";

export function BattleUnlockedPoolCard({
  pool,
  userEntry,
  selectedSeason,
  latestBattle,
  userBetslip,
  setUserBetslip,
  setLoading,
}) {
  const { memberships } = usePoolDetails(pool.id);
  const totalMembers = memberships.length;
  const createdBetslips = latestBattle.betslip_count;
    const participationRate = totalMembers > 0
    ? (createdBetslips / totalMembers) * 100
    : 0;

  const handleMyBetslip = async () => {
    if (userBetslip) {
      router.push(
        `/pools/${pool.id}/battles/${latestBattle.id}/?betslipId=${userBetslip.id}`
      );
    } else {
      try {
        setLoading?.(true);

        const res = await api.post(
          `/pools/${pool.id}/league_seasons/${selectedSeason.id}/battles/${latestBattle.id}/betslips`,
          {
            betslip: {
              name: null,
              status: "created",
            },
          }
        );

        const betslipId = res.data.id;
        setUserBetslip(res.data); // cache if needed

        router.push(
          `/pools/${pool.id}/battles/${latestBattle.id}/?betslipId=${betslipId}`
        );
      } catch (error) {
        console.error("Failed to create betslip:", error);
        Alert.alert("Error", "Unable to create betslip.");
      } finally {
        setLoading?.(false);
      }
    }
  };

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
            <Txt style={s.infoTitleTxt}>League Participation:</Txt>
            <Txt style={s.txt}>{participationRate.toFixed(1)}%</Txt>
          </View>
          <TouchableOpacity style={s.infoUnitContainer} onPress={handleMyBetslip}>
            <Txt style={s.infoTitleTxt}>My Betslip:</Txt>
            <Txt style={s.txt}>$4500 to bet</Txt>
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
