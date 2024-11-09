import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function BetOptionHeading({ title, amountWon, amountRemaining}) {
  return (
    <View style={s.container}>
      <View>
        <Txt style={s.titleText}>{title}</Txt>
      </View>
			{/* <View style={s.payoutContainer}>
				<View style={s.amountContainer}>
					<Txt style={[s.txt, s.boldText]}>${amountWon}</Txt>
					<Txt style={s.txt}> Won</Txt>
				</View>
				<View style={s.amountContainer}>
					<Txt style={[s.txt, s.boldText]}>${amountRemaining}</Txt>
					<Txt style={s.txt}> To Win</Txt>
				</View>
			</View> */}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
		flexDirection: 'row',
    backgroundColor: "#184EAD",
    paddingHorizontal: 8,
    paddingVertical: 4,
		alignItems: 'center',
		justifyContent: 'space-between'
  },
  titleText: {
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },
	payoutContainer: {
		alignItems: 'flex-end'
	},
	amountContainer: {
		flexDirection: 'row',
	},
	txt: {
		fontSize: 14,
	},
  boldText: {
    fontFamily: "Saira_600SemiBold",
    // textTransform: 'uppercase'
  },

});
