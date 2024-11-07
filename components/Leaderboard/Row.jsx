import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { router } from "expo-router";
import { StatusIcon } from "../general/StatusIcon";

export function Row({ betslip, poolId, battle, backgroundColor }) {
  return (
    <View style={[s.container, { backgroundColor }]}>
      <View style={s.firstRowElement}>
        <Txt style={s.txt}>{betslip.name}</Txt>
      </View>
      <View style={s.rowElement}>
        <Txt style={s.txt}>${betslip.earnings}</Txt>
      </View>
      <View style={s.rowElement}>
        <Txt style={s.txt}>${betslip.max_payout_remaining}</Txt>
      </View>
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
    alignItems: "center",
    paddingVertical: 4,
  },
  firstRowElement: {
    flex: 2.5,
    paddingLeft: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  rowElement: {
    flex: 1,
    alignItems: "center",
    // borderLeftWidth: 1,
    // borderColor: '#B8C3CC'
  },
  txt: {
    color: "#061826",
    fontSize: 14,
  },
  btn: {
    paddingVertical: 2,
    paddingHorizontal: 12,
    // margin: 4,
  },
  statusIcon: {
    height: 8,
    width: 8,
    borderRadius: 100,
    backgroundColor: "#AB1126",
    marginRight: 4,
  },
  isSubmitted: {
    backgroundColor: "#0C9449",
  },
});
