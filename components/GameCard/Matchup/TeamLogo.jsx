import { Image, StyleSheet, View } from "react-native";
import { logoMap, nameMap } from "../../../utils/teamLogoMap";

export function TeamLogo({ teamName, size = 22 }) {
  const slug = nameMap[teamName];
  const logo = slug && logoMap[slug];

  const source = logo || require("@/assets/teamLogos/team.png");

  return (
    <Image
      source={source}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

const s = StyleSheet.create({

});
