import React, { useRef, useState } from "react";
import { FlatList, StyleSheet, View, Dimensions } from "react-native";
import { Txt } from "../general/Txt";
import { MembershipRow } from "./MembershipRow";

export function MembershipsTable({ containerWidth, memberships, setMemberships, poolId, fetchPoolMemberships, showMessage }) {
  const PAGE_WIDTH = containerWidth || Dimensions.get("window").width;
  const membersPerPage = 1;
  const pages = Math.ceil(memberships.length / membersPerPage);
  const flatListRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const groupedMembers = Array.from({ length: pages }, (_, i) =>
    memberships.slice(i * membersPerPage, (i + 1) * membersPerPage)
);
  // Dots
  const MAX_VISIBLE_DOTS = 5;
  const visibleStart = Math.max(0, Math.min(currentPage - Math.floor(MAX_VISIBLE_DOTS / 2), pages - MAX_VISIBLE_DOTS));
  const visibleDots = groupedMembers.slice(visibleStart, visibleStart + MAX_VISIBLE_DOTS);

  const handleScroll = (event) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / PAGE_WIDTH);
    setCurrentPage(page);
  };

  return (
    <View>
      <Txt style={s.titleText}>League Members</Txt>
      <FlatList
        ref={flatListRef}
        data={groupedMembers}
        keyExtractor={(_, i) => `page-${i}`}
        renderItem={({ item }) => (
          <View style={{ width: PAGE_WIDTH }}>
            {item.map((member, index) => (
              <MembershipRow
                key={member.id}
                member={member}
                isLast={index === item.length - 1}
                poolId={poolId}
                fetchPoolMemberships={fetchPoolMemberships}
                showMessage={showMessage}
              />
            ))}
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Page dots */}
      <View style={s.dotsContainer}>
  {visibleDots.map((_, i) => {
    const actualIndex = i + visibleStart;
    return (
      <View
        key={actualIndex}
        style={[
          s.dot,
          currentPage === actualIndex ? s.activeDot : s.inactiveDot,
        ]}
      />
    );
  })}
</View>
    </View>
  );
}

const s = StyleSheet.create({
  titleText: {
    color: "#F8F8F8",
    fontSize: 24,
  },
  // page: {
  //   width: PAGE_WIDTH,
  // },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#54D18C",
  },
  inactiveDot: {
    backgroundColor: "#B8C3CC",
  },
});
