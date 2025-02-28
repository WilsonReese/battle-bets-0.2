import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { router } from "expo-router";

export function PoolCard({ pool }) {
  return (
    <View style={s.card}>
      <Txt style={s.heading}>{pool.name}</Txt>
      <View style={s.section}>
        <View style={s.detailsSection}>
          <Txt style={s.txt}>25 points</Txt>
          <Txt style={s.txt}>4th place</Txt>
        </View>
        <View style={s.btnSection}>
          <Btn
            btnText={`Go to ${pool.name}`}
            style={s.btn}
            isEnabled={true}
            onPress={() => router.push(`/pools/${pool.id}/`)}
          />
        </View>
      </View>
      <View style={s.horizontalLine} />
      <View>
        <Txt style={s.heading}>Current Battle</Txt>
        {/* THIS SECTION WILL NEED TO BE DYNAMIC DEPENDING ON BETSLIP STATUS */}
        <View style={s.section}>
          <View style={s.detailsSection}>
            <Txt style={s.txt}>0/12 betslips submitted</Txt>
            <Txt style={s.txt}>Make bets before games start</Txt>
          </View>
          <View style={s.btnSection}>
            <Btn
              btnText={'Fix Routing'}
              style={s.btn}
              isEnabled={true}
              onPress={() => router.push(`/pools/${pool.id}/`)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#DAE1E5",
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  heading: {
    color: "#061826",
    fontFamily: "Saira_600SemiBold",
    paddingVertical: 4,
    // fontSize: 18,
  },
  txt: {
    color: "#061826",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  btnSection: {
    // flex: 2,
    backgroundColor: 'blue',
  },
  detailsSection: {
    flex: 4,
    backgroundColor: 'green'
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#B8C3CC",
    alignSelf: "stretch",
    marginVertical: 8,
    // width: 100,
  },
  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    // margin: 4,
  },
});
