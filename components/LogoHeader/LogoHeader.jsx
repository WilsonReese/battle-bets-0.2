import { Image, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

export function LogoHeader({}) {
  return (
    <View style={s.container}>
      <Image style={s.image} source={require('../../assets/images/white_logo.png')} />
      <Txt>
        Progress
      </Txt>
    </View>
  );
}

const s = StyleSheet.create({
  image: {
    height: 24,
    width: 157,
    resizeMode: "contain",
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  }
});
