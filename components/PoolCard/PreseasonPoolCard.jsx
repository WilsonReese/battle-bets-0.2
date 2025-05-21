import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { router } from "expo-router";
import { InviteUsersButton } from "../PoolDetails/InviteUsers/InviteUsersButton";
import * as Clipboard from 'expo-clipboard';

export function PreseasonPoolCard({ pool }) {

  return (
    <View style={s.card}>
      <Txt style={s.heading}>Preseason</Txt>
      <Txt>Members: {pool.membership_count}</Txt>
      <Txt>Start Week: Week {pool.start_week}</Txt>
      <InviteUsersButton poolId={pool.id} inviteToken={pool.invite_token} />

      <View style={s.btnContainer}>
        <Btn
          btnText={`Go to ${pool.name}`}
          onPress={() => router.push(`/pools/${pool.id}/`)}
          isEnabled={true}
          style={s.btn}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#DAE1E5",
    marginVertical: 4,
    borderRadius: 8,
    padding: 12,
  },
  heading: {
    color: "#061826",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  btnContainer: {
    marginTop: 12,
    gap: 8,
  },
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
});