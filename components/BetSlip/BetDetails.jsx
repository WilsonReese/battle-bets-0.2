import React from "react";
import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetDetails({ name, matchup, time, multiplier }) {
  return (
    <View style={[s.container]}>
      <View style={s.matchupContainer}>
        <Txt style={[s.smallTxt]}>{matchup}</Txt>
        {/* <Txt style={[s.smallTxt]}>{time}</Txt> */}
      </View>
      <View style={s.betInfoContainer}>
        <View style={s.betNameContainer}>
          <Txt style={[s.betNameTxt]}>{name}</Txt>
        </View>
        <View style={s.betPayoutContainer}>
          <Txt style={[s.payoutTxt]}>x{multiplier}</Txt>
        </View>
      </View>
    </View>
		// <View style={s.container}>
		// 	<View style={s.betDetailsContainer}>
		// 		<View>
		// 			<Txt style={[s.smallTxt]}>{matchup}</Txt>
		// 		</View>
		// 		<View>
		// 			<Txt style={[s.betNameTxt]}>{name}</Txt>
		// 		</View>
		// 	</View>
		// 	<View>
		// 		<Txt style={[s.payoutTxt]}>x{multiplier}</Txt>
		// 	</View>
		// </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  betInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 2,
  },
  betNameContainer: {
    flex: 4,
		flexDirection: 'row',
		paddingRight: 8,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // backgroundColor: 'green'
  },
  betPayoutContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingLeft: 4,
		borderRadius: 4,
		backgroundColor: '#54D18C',
  },
  betNameTxt: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 15,
    lineHeight: 18,
    textAlignVertical: "center",
    paddingTop: 3,
		color: "#061826",
  },
  matchupContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
  },
	payoutTxt: {
		color: "#061826",
		fontSize: 12,
	},
  smallTxt: {
    fontSize: 10,
		color: '#6E7880'
  },
});
