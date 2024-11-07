import { Alert, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { Leaderboard } from "../Leaderboard/Leaderboard";
import { format } from "date-fns";
import api from "../../utils/axiosConfig";
import { router } from "expo-router";

export function BattleCard({ userBetslip, poolId, battle }) {
  const handleMakeBets = async (battle, poolId) => {
    try {
      const response = await api.post(
        `/pools/${poolId}/battles/${battle.id}/betslips`,
        {
          betslip: {
            name: null, // Name can be null or set to a default value
            status: "created",
          },
        }
      );

      // Get the created betslip's ID from the response
      const betslipId = response.data.id;

      // After betslip is created, navigate to the betslip or battle page
      router.push({
        pathname: `pools/${poolId}/battles/${battle.id}/`,
        params: { betslipId }, // Pass the betslipId as a query parameter
      });
    } catch (error) {
      console.error("Error creating betslip:", error?.response?.data || error);
      Alert.alert("Error", "Failed to create betslip. Please try again.");
    }
  };

  const battleEndDate = format(new Date(battle.end_date), "MMMM d");

  return (
    <View style={s.container}>
      <View style={s.headingContainer}>
        <Txt style={s.headingTxt}>Battle on {battleEndDate}</Txt>
        <Txt style={s.txt}>
					{battle.betslip_count} {battle.betslip_count === 1 ? "Player" : "Players"}
				</Txt>
      </View>
      {/* Betslip has not been created */}
      {!userBetslip && (
        <View >
          <View style={s.btnContainer}>
            <Btn
              btnText={"Make Bets"}
              style={s.btn}
              isEnabled={true}
              onPress={() => handleMakeBets(battle, poolId)}
            />
          </View>
          <Txt style={s.txtItalic}>
            Submit your betslip by 11 AM on {battleEndDate}
          </Txt>
        </View>
      )}

      {/* Betslip has been created but not submitted */}
      {userBetslip && userBetslip.status == "created" && (
        <View>
          <Txt style={s.txt}>
            Edit button with indication that betslip not submitted
          </Txt>
          <Btn
            btnText={"Edit Bets"}
            style={s.btn}
            isEnabled={true}
            onPress={() =>
              router.push(
                `/pools/${poolId}/battles/${battle.id}/?betslipId=${userBetslip.id}`
              )
            }
          />
        </View>
      )}

      {/* Betslip is submitted */}
      {userBetslip && userBetslip.status == "submitted" && (
        <Leaderboard
          userBetslip={userBetslip}
          poolId={poolId}
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
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#3A454D",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#DAE1E5",
  },
  btnContainer: {
    paddingVertical: 8,
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
  },
  headingTxt: {
    color: "#061826",
    fontFamily: "Saira_600SemiBold",
    // letterSpacing: "2%",
    fontSize: 20,
    // textTransform: "uppercase"
  },
  txt: {
    // fontFamily: "Saira_300Light",
    color: "#061826",
    fontSize: 16,
  },
  txtItalic: {
    fontFamily: "Saira_400Regular_Italic",
    color: "#061826",
    fontSize: 14,
    textAlign: "center",
  },
});
