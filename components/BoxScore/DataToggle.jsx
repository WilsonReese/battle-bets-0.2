import { Dimensions, StyleSheet, TouchableOpacity, View,  } from "react-native";
import { Txt } from "../general/Txt";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const TOGGLE_WIDTH = Dimensions.get("window").width * 0.9
const PILL_WIDTH = TOGGLE_WIDTH / 2 - 3; // the -3 makes the width slightly smaller so it fits inside the container

export function DataToggle({ optionLeft, optionRight, selected, onSelect }) {
  const isLeftSelected = selected === optionLeft;
  const offset = useSharedValue(isLeftSelected ? 3 : PILL_WIDTH + 3);

  useEffect(() => {
    offset.value = withTiming(isLeftSelected ? 3 : PILL_WIDTH + 3, { duration: 200 }); // the 3s help with the offset of where the pill is in the container
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const handleToggle = () => {
    const newSelected = isLeftSelected ? optionRight : optionLeft;
    onSelect(newSelected);
  };

  return (
    <TouchableOpacity style={s.container} onPress={handleToggle} activeOpacity={0.9}>
      <Animated.View style={[s.pill, animatedStyle]} />
      <View style={s.labelsContainer}>
        <View style={s.label}>
          <Txt style={isLeftSelected ? s.selectedTxt : s.unselectedTxt}>
            {optionLeft}
          </Txt>
        </View>
        <View style={s.label}>
          <Txt style={!isLeftSelected ? s.selectedTxt : s.unselectedTxt}>
            {optionRight}
          </Txt>
        </View>
      </View>
    </TouchableOpacity>
  );
}


const s = StyleSheet.create({
  container: {
    width: TOGGLE_WIDTH,
    height: 36,
    backgroundColor: "#0F2638",
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
  },
  pill: {
    position: "absolute",
    width: PILL_WIDTH,
    height: 30,
    backgroundColor: "#54D18C",
    borderRadius: 50,
    zIndex: 0,
  },
  labelsContainer: {
    flexDirection: "row",
    zIndex: 1,
  },
  label: {
    width: PILL_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTxt: {
    color: "#F8F8F8",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },
  unselectedTxt: {
    color: "#C7CDD1",
    fontSize: 14,
  },
});
