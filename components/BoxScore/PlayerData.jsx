import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";

export function PlayerData({ stats }) {

  // Need to get stats[#] where name: passing
  // If there is not a name for the thing I care about, then I need to say "No passing stats for this game"
  const passing = stats[0]
  // const rushing = stats[0]
  // const rushing = stats[1]
  // const receiving = stats[2]
  // const fumbles = stats[3]
  // const defensive = stats[4]
  // const kick_returns = stats[5]
  // const kicking = stats[6]
  // const punting = stats[7]



  return (
    <View>
      <Txt>Offense</Txt>
      <Txt>Passing</Txt>

      {/* Need to loop through all the numbers to get all the players */}
      {/* Then I need to loop through all the statistics and show each name and value */}
      {/* Will need to make sure that each name/value pair has the space that it needs */}

      <Txt>{passing.players[0].player.name}</Txt>
      <Txt>{passing.players[0].statistics[0].name}</Txt>
      <Txt>{passing.players[0].statistics[0].value}</Txt>
      
      <Txt>Rushing</Txt>
      <Txt>Receiving</Txt>

      <Txt> </Txt>

      <Txt>Defense</Txt>
      <Txt>Defensive</Txt>
      <Txt>Fumbles</Txt>
      <Txt>Interceptions</Txt>

      <Txt> </Txt>

      <Txt>Special Teams</Txt>
      <Txt>Kicking</Txt>
      <Txt>Punting (very exciting)</Txt>
      <Txt>Kick Returns</Txt>
      <Txt>Punt Returns</Txt>
      <Txt>{stats[3].name}</Txt>
    </View>
  );
}

const s = StyleSheet.create({

});
