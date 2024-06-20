import { Image, StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";

// I may need to change this so that the progress area shows up if something is passed to it or it is just blank
// It will take some thought on how to make that show up how I want it to

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
  }
});
