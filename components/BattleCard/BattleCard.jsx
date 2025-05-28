import { Alert, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { Leaderboard } from "../Leaderboard/Leaderboard";
import { format } from "date-fns";
import api from "../../utils/axiosConfig";
import { router } from "expo-router";
import { StatusIcon } from "../general/StatusIcon";

export function BattleCard({
  userBetslip,
  poolId,
  season,
  battle,
  setBattles,
  setUserBetslip,
  setLoading,
}) {
  const battleEndDate = format(new Date(battle.end_date), "MMMM d");

  const handleEditBets = () => {
    if (!userBetslip) {
      Alert.alert("No betslip found", "Please refresh or try again.");
      return;
    }

    router.push(
      `/pools/${poolId}/battles/${battle.id}/?betslipId=${userBetslip.id}`
    );
  };

  console.log('User Betslip Locked?', userBetslip.locked)
  console.log('User Betslip Status?', userBetslip.status)

  return (
    <View style={s.container}>
      <View style={s.headingContainer}>
        <Txt style={s.headingTxt}>Battle on {battleEndDate}</Txt>
        <Txt style={s.txt}>
          {battle.betslip_count}{" "}
          {battle.betslip_count === 1 ? "Player" : "Players"}
        </Txt>
      </View>
      {/* Betslip has not been created */}
      {!userBetslip && (
        <View>
          <Txt>No betslip</Txt>
        </View>
      )}

      {/* Betslip has been created but not filled out */}
      {userBetslip.status == "created" && (
        <View>
          <View style={s.btnContainer}>
            <Btn
              btnText={"Make Bets"}
              style={s.btn}
              // isEnabled={true}
              isEnabled={!battle.locked}
              onPress={handleEditBets}
            />
          </View>
          <View style={s.submitBetsNoticeContainer}>
            <Txt style={s.txtItalic}>
              Save your betslip by 11 AM on {battleEndDate}
            </Txt>
          </View>
        </View>
      )}

      {/* Betslip has been filled out but the battle isn't locked */}
      {(userBetslip.status === "filled_out" && !userBetslip.locked) && (
        <View style={s.btnContainer}>
          <Btn
            btnText={"Edit Bets"}
            style={s.btn}
            isEnabled={!battle.locked}
            onPress={handleEditBets}
          />
          <View style={s.notSubmittedIndicatorContainer}>
            <StatusIcon isPositive={false} />
            <Txt style={[s.txtItalic, { marginLeft: 4 }]}>
              Betslip Not Submitted
            </Txt>
          </View>
          <View style={s.submitBetsNoticeContainer}>
            <Txt style={s.txtItalic}>
              Submit your betslip by 11 AM on {battleEndDate}
            </Txt>
          </View>
        </View>
      )}

      {/* NEED TO UPDATE THIS - Betslip locked */}
      {userBetslip.locked && (
        <Leaderboard
          userBetslip={userBetslip}
          poolId={poolId}
          leagueSeasonId={season.id}
          battle={battle}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    // alignSelf: "stretch",
    // borderWidth: 1,
    // borderColor: "#3A454D",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#0F2638",
  },
  btnContainer: {
    paddingTop: 8,
  },
  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    // margin: 4,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  headingTxt: {
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    // letterSpacing: "2%",
    fontSize: 20,
    // textTransform: "uppercase"
  },
  txt: {
    // fontFamily: "Saira_300Light",
    // color: "#061826",
    fontSize: 16,
  },
  txtItalic: {
    fontFamily: "Saira_400Regular_Italic",
    // color: "#061826",
    fontSize: 14,
    // textAlign: "center",
  },
  notSubmittedIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingTop: 4,
  },
  submitBetsNoticeContainer: {
    alignItems: "center",
  },
});
