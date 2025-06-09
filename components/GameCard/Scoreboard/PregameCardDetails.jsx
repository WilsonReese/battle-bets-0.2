import { StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { format } from "date-fns";

export function PregameCardDetails({ game }) {
  return (
    <View style={s.container}>
      <Txt style={s.timeTxt}>{format(new Date(game.start_time), "h:mm a")}</Txt>
      {/* <Txt style={s.txt}>-</Txt> */}
      <Txt style={s.dateTxt}>{format(new Date(game.start_time), "MMMM d")}</Txt>
      <Txt>{game.away_team.conference}</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    // gap: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
    // paddingBottom: 6, 
  },
  dateTxt: {
    fontSize: 12,
    color: '#C7CDD1'
  },
  timeTxt: {
    fontFamily: 'Saira_600SemiBold',
    fontSize: 12,
    color: '#C7CDD1'
  },
});
