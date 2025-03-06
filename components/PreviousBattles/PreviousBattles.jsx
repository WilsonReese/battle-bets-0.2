import {  StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { format } from "date-fns";


export function PreviousBattles({ battles }) {

  return (
    <View style={s.container}>
        <View style={s.titleContainer}>
          <Txt style={s.titleText}>Previous Battles</Txt>
        </View>
        {battles.map((battle) => (
          <Txt key={battle.id} style={s.txt}>
            {format(new Date(battle.end_date), "MMMM d")}
          </Txt>
        ))}
        <Txt>Need to remove the first battle in the list. Need to get important battle information: Date, # players, user amount won, user placement, drop down to show the battle card for previous battles?</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    // padding: 8,
    // backgroundColor: "#DAE1E5",
  },
  titleContainer: {
    paddingTop: 8,
    paddingBottom: 4
  },
  titleText: {
    color: "#F8F8F8",
    fontSize: 20,
  },
});
