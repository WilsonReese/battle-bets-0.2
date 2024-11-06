import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { router } from "expo-router";

export function Row({ betslip, poolId, battle, backgroundColor }) {
  return (
    <View style={[s.container, {backgroundColor}]}>
      {betslip && (
        <View style={s.firstRowElement}>
          <Txt style={s.txt}>{betslip.name}</Txt>
        </View>
      )}
      {betslip && (
        <View style={s.rowElement}>
          <Txt style={s.txt}>${betslip.earnings}</Txt>
        </View>
      )}

      {betslip && (
        <View style={s.rowElement}>
          <Txt style={s.txt}>${betslip.max_payout_remaining}</Txt>
        </View>
      )}
      <View style={s.rowElement}>
        <Btn
          btnText={"Edit"}
          style={s.btn}
          isEnabled={true}
          onPress={() =>
            router.push(
              `/pools/${poolId}/battles/${battle.id}/?betslipId=${betslip.id}`
            )
          }
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    paddingVertical: 4,
  },
  firstRowElement: {
    flex: 1.75,
  },
  rowElement: {
    flex: 1,
    alignItems: "center",
  },
  txt: {
    color: "#061826",
    fontSize: 14,
  },
  btn: {
    paddingVertical: 2,
    paddingHorizontal:12,
    // margin: 4,
  },
});
