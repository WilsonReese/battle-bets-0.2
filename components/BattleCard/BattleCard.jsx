import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { Leaderboard } from "../Leaderboard/Leaderboard";
import { format } from "date-fns";

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
      console.error("Error creating betslip:", error.response.data);
      Alert.alert("Error", "Failed to create betslip. Please try again.");
    }
  };

  const battleEndDate = format(new Date(battle.end_date), "MMMM d")

  return (
    <View style={s.container}>
      <Txt style={s.headingTxt}>Battle on {battleEndDate}</Txt>
      <Txt style={[s.txt, { color: "black" }]}># Players</Txt>

      {/* Betslip has not been created */}
      {!userBetslip && (
        <Btn
          btnText={"Make Bets"}
          style={s.btn}
          isEnabled={true}
          onPress={() => handleMakeBets(battle.id, poolId)}
        />
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
  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    // margin: 4,
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
    color: "#F8F8F8",
    fontSize: 16,
  },
});
