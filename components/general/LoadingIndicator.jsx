import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Txt } from "./Txt";

export function LoadingIndicator({ color, contentToLoad }) {
    const textColor = color === "dark" ? s.dark.color : s.light.color;
    const indicatorColor = color === "dark" ? s.dark.color : s.light.color;
  
    return (
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color={indicatorColor} />
          <Txt style={{ color: textColor }}>Loading {contentToLoad}</Txt>
        </View>
  );
}

const s = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  light: {
    color: "#F8F8F8"
  },
  dark: {
    color: "#184EAD"
  }
});
