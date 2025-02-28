import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function PoolCard({ pool }) {
  
  return (
    <View>
      <Txt>{pool.name}</Txt>
    </View>
  );
}

const s = StyleSheet.create({

});
