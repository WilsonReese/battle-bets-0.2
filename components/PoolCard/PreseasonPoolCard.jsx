import { StyleSheet, View, } from "react-native";
import { Txt } from "../general/Txt";
import { InviteUsersButton } from "../PoolDetails/InviteUsers/InviteUsersButton";

export function PreseasonPoolCard({ pool }) {
  return (
    <View style={s.container}>
      <View style={s.detailContainer}>
        <Txt style={s.detailsHeadingTxt}>Members: </Txt>
        <Txt style={s.txt}>{pool.membership_count}</Txt>
      </View>
      <View style={s.detailContainer}>
        <Txt style={s.detailsHeadingTxt}>Season Start: </Txt>
        <Txt style={s.txt}>Week {pool.start_week}</Txt>
      </View>

      <InviteUsersButton poolId={pool.id} inviteToken={pool.invite_token} textStyle={s.txt} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // paddingBottom: 8,
  },
  heading: {
    color: "#061826",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  detailsHeadingTxt: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  txt: {
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: "row",
  },
  rightColumn: {},
});
