import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { MembershipRow } from "./MembershipRow";

export function MembershipsTable({ memberships, setMemberships, poolId}) {
  return (
    <View>
      <Txt style={s.titleText}>League Members</Txt>
      {memberships.map((member, index) => (
        <MembershipRow
          key={member.id}
          member={member}
          isLast={index === memberships.length - 1}
          poolId={poolId}
          onRemove={(removedId) =>
            setMemberships((prev) => prev.filter((m) => m.id !== removedId))
          }
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
