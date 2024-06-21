import { Button, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Btn";

export function BetSlipPreview({}) {
  return (
    <View style={s.container}>
      <View style={s.grabHandle}>
        <Txt style={{margin: -8, color: "black"}}>----</Txt>
      </View>
      <View style={s.detailsContainer}>
        <View>
          <Txt>Title</Txt>
          <Txt>Budget</Txt>
        </View>
        <View>
					<Btn btnText={"Next"} isEnabled={false} btnSecondaryText={"Money Line"}/>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // this keeps the betslip preview on the bottom and spanning the width
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
    justifyContent: "center",
    paddingVertical: 4,
		paddingHorizontal: 16,
		
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#F8F8F8",

    // shadow
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		
		elevation: 5,
  },
  grabHandle: {
    alignSelf: "center",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
