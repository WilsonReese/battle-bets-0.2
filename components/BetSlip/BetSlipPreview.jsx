import React, { useRef } from "react";
import { StyleSheet, View, Animated, PanResponder, Dimensions } from "react-native";
import { Txt } from "../general/Txt";
import { FontAwesome6 } from "@expo/vector-icons";
import { BetSlipBudget } from "./BetSlipBudget";

const { height } = Dimensions.get('window');
const betSlipHeight = height * 2 / 3; // 2/3 of the screen height
const visiblePosition = height - betSlipHeight;
const hiddenPosition = height - 80; // Height of the visible part above the tabs

export function BetSlipPreview({ budget, totalBet, poolName }) {
  const translateY = useRef(new Animated.Value(hiddenPosition)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 20;
      },
      onPanResponderMove: (evt, gestureState) => {
        const newTranslateY = hiddenPosition + gestureState.dy;
        // Clamp the translateY value to prevent it from going below hiddenPosition
        if (newTranslateY >= visiblePosition && newTranslateY <= hiddenPosition) {
          translateY.setValue(newTranslateY);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 50) {
          // Close the BetSlip
          Animated.timing(translateY, {
            toValue: hiddenPosition,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else {
          // Open the BetSlip
          Animated.timing(translateY, {
            toValue: visiblePosition,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleOpen = () => {
    Animated.timing(translateY, {
      toValue: visiblePosition,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(translateY, {
      toValue: hiddenPosition,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[s.container, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
      <View style={s.preview} onTouchStart={handleOpen}>
        <View style={s.betSlipHeading}>
          <View style={s.grabHandleContainer}>
            <View style={s.grabHandle}></View>
          </View>
          <View style={s.detailsContainer}>
            <Txt style={s.title}>Bet Slip - Pool {poolName}</Txt>
          </View>
        </View>
        <BetSlipBudget
          betType={"Spread and Over/Under"}
          budget={budget}
          totalBet={totalBet}
        />
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 278,
    left: 0,
    right: 0,
    height: betSlipHeight,
    backgroundColor: "#F8F8F8",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // preview: {
  //   flex: 1,
  //   justifyContent: "center",
  // },
  betSlipHeading: {
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 20,
    color: "#061826",
    fontFamily: "Saira_600SemiBold",
  },
  grabHandleContainer: {
    alignSelf: "center",
    paddingTop: 8,
    paddingBottom: 8,
  },
  grabHandle: {
    height: 4,
    width: 80,
    backgroundColor: "#6E7880",
    borderRadius: 10,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});