import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";

export function CountdownTimer({ targetDate, version = "small" }) {
  const getTimeLeft = (targetDate) => {
    const now = new Date();
    const total = targetDate - now;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.total <= 0) {
    return <Txt style={{ fontSize: 14 }}>Battle Started</Txt>;
  }

  return (
    <>
      {version === "small" && (
        <View style={s.containerSmall}>
          <View style={s.countdownElementSmall}>
            <Txt style={s.countdownTxtSmall}>{timeLeft.days}</Txt>
            <Txt style={s.timeUnitTxtSmall}>days</Txt>
          </View>

          <View style={s.countdownElementSmall}>
            <Txt style={s.countdownTxtSmall}>{timeLeft.hours}</Txt>
            <Txt style={s.timeUnitTxtSmall}>hours</Txt>
          </View>

          <View style={s.countdownElementSmall}>
            <Txt style={s.countdownTxtSmall}>{timeLeft.minutes}</Txt>
            <Txt style={s.timeUnitTxtSmall}>minutes</Txt>
          </View>

          <View style={s.countdownElementSmall}>
            <Txt style={s.countdownTxtSmall}>{timeLeft.seconds}</Txt>
            <Txt style={s.timeUnitTxtSmall}>seconds</Txt>
          </View>
        </View>
      )}

      {version === "large" && (
        <View style={s.containerLarge}>
          <View style={s.countdownElementLarge}>
            <Txt style={s.countdownTxtLarge}>{timeLeft.days}</Txt>
            <Txt style={s.timeUnitTxtLarge}>days</Txt>
          </View>

          <View style={s.countdownElementLarge}>
            <Txt style={s.countdownTxtLarge}>{timeLeft.hours}</Txt>
            <Txt style={s.timeUnitTxtLarge}>hours</Txt>
          </View>

          <View style={s.countdownElementLarge}>
            <Txt style={s.countdownTxtLarge}>{timeLeft.minutes}</Txt>
            <Txt style={s.timeUnitTxtLarge}>minutes</Txt>
          </View>

          <View style={s.countdownElementLarge}>
            <Txt style={s.countdownTxtLarge}>{timeLeft.seconds}</Txt>
            <Txt style={s.timeUnitTxtLarge}>seconds</Txt>
          </View>
        </View>
      )}
    </>
  );
}

const s = StyleSheet.create({
  containerLarge: {
    flexDirection: "row",
    paddingHorizontal: 4,
    // backgroundColor: 'blue'
  },
  countdownElementLarge: {
    flex: 1,
    alignItems: "center",
  },
  countdownTxtLarge: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 30,
    marginBottom: -4,
  },
  timeUnitTxtLarge: {
    fontSize: 12,
  },


  containerSmall: {
    flexDirection: "row",
    // paddingHorizontal: 24,
    // backgroundColor: 'orange',
    // alignItems: 'flex-start'
    justifyContent: 'center',
    gap: 30,
  },
  countdownElementSmall: {
    // flex: 1,
    alignItems: "center",
  },
  countdownTxtSmall: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 20,
    marginBottom: -4,
  },
  timeUnitTxtSmall: {
    fontSize: 10,
  },
});
