import { Image, StyleSheet, View } from "react-native";
import { logoMap, nameMap } from "../../../utils/teamLogoMap";

export function TeamLogo({ teamName, size = 22 }) {
  const slug = nameMap[teamName];
  const logo = slug ? logoMap[slug] : null;

  if (!logo) return null;

  return (
    <Image
      source={logo}
      style={{ width: size, height: size,}}
      resizeMode="contain"
    />
  );
}

const s = StyleSheet.create({

});
