import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";
import { MembershipRow } from "./MembershipRow";
import { Btn } from "../general/Buttons/Btn";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function MembershipsTable({
  memberships,
  setMemberships,
  poolId,
  fetchPoolMemberships,
  showMessage,
  page,
  totalPages,
  setPage,
}) {
  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
      fetchPoolMemberships(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
      fetchPoolMemberships(page - 1);
    }
  };

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
          fetchPoolMemberships={fetchPoolMemberships}
          showMessage={showMessage}
        />
      ))}

      <View style={s.paginationContainer}>
        {page > 1 ? (
          <TouchableOpacity onPress={handlePrev} style={s.iconButton}>
            <FontAwesome6
              name="arrow-left"
              size={16}
              color={"#54D18C"}
            />
          </TouchableOpacity>
        ) : (
          <View style={s.iconPlaceholder} />
        )}
        <Txt style={s.pageIndicator}>{`Page ${page} of ${totalPages}`}</Txt>

        {page < totalPages ? (
          <TouchableOpacity onPress={handleNext} style={s.iconButton}>
                      <FontAwesome6
            name="arrow-right"
            size={16}
            color={"#54D18C"}
          />
          </TouchableOpacity>
        ) : (
          <View style={s.iconPlaceholder} />
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  titleText: {
    color: "#F8F8F8",
    fontSize: 24,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  pageIndicator: {
    color: "#F8F8F8",
    fontSize: 12,
    paddingHorizontal: 12,
  },
  iconButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  iconPlaceholder: {
    width: 64, // this needs to equal the width of the icon and iconButton padding
  },
});
