import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

export function Message({ message, color, duration = 1000, onHide, location = 40 }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Reset to full opacity before starting fadeOut
    opacity.setValue(1);

    const fadeOut = Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    });

    const timer = setTimeout(() => {
      fadeOut.start(() => {
        onHide();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onHide]);

  return (
    <Animated.View style={[
      s.messageContainer,
      { opacity, backgroundColor: color, top: location }
    ]}>
      <Text style={s.messageText}>{message}</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  messageContainer: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    zIndex: 1,
  },
  messageText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
