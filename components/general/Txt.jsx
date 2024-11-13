import { StyleSheet, Text } from "react-native";

export function Txt({ children, style, ...restProps }) {
  return (
    <Text style={[s.txt, style]} {...restProps}>
      {children}
    </Text>
  );
}

const s = StyleSheet.create({
  txt: {
    color: "#F8F8F8",
    fontSize: 16,
    fontFamily: "Saira_400Regular",
  },
});
