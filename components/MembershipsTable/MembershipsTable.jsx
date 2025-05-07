import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { MembershipRow } from "./MembershipRow";

export function MembershipsTable({ memberships }) {
  return (
    <View>
      <Txt style={s.titleText}>League Members</Txt>
      {memberships.map((member, index) => (
        <MembershipRow
          key={member.id}
          member={member}
          isLast={index === memberships.length - 1}
        />
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  titleText: {
    color: "#F8F8F8",
    fontSize: 24,
  },
});
