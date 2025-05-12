import React, { useContext, useRef, useState } from "react";
import { Animated, FlatList, StyleSheet, View, Dimensions } from "react-native";
import { Txt } from "../../general/Txt";
import { MembershipRow } from "./MembershipRow";

export function MembershipsTable({
  containerWidth,
  memberships,
  setMemberships,
  poolId,
  fetchPoolMemberships,
  isCurrentUserCommissioner
}) {
  const PAGE_WIDTH = containerWidth || Dimensions.get("window").width;
  const MEMBERS_PER_PAGE = 12;

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const pages = Math.ceil(memberships.length / MEMBERS_PER_PAGE);
  const groupedMembers = Array.from({ length: pages }, (_, i) =>
    memberships.slice(i * MEMBERS_PER_PAGE, (i + 1) * MEMBERS_PER_PAGE)
  );

  return (
    <View>
      <Txt style={s.titleText}>League Members</Txt>

      <Animated.FlatList
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
                isCurrentUserCommissioner={isCurrentUserCommissioner}
              />
            ))}
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Dot pagination */}
      {/* Scrollable dot strip that moves with swipe */}
      {pages > 1 && (
        <View style={s.dotScrollContainer}>
          <Animated.View
            style={[
              s.dotsWrapper,
              {
                transform: [
                  {
                    translateX: scrollX.interpolate({
                      inputRange: [0, PAGE_WIDTH * (pages - 1)],
                      outputRange: [0, -((8 + 12) * (pages - 1)) / 2], // width + margin * (pages - 1) / 2
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          >
            {groupedMembers.map((_, i) => {
              const inputRange = [
                (i - 1) * PAGE_WIDTH,
                i * PAGE_WIDTH,
                (i + 1) * PAGE_WIDTH,
              ];

              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [1, 1.4, 1],
                extrapolate: "clamp",
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={i}
                  style={[
                    s.dot,
                    {
                      transform: [{ scale }],
                      opacity,
                    },
                  ]}
                />
              );
            })}
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  titleText: {
    color: "#F8F8F8",
    fontSize: 24,
  },
  dotScrollContainer: {
    height: 24,
    alignItems: "center",
    overflow: "hidden",
    marginHorizontal: 60,
    paddingVertical: 10,
  },
  dotsWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
    backgroundColor: "#54D18C",
  },
});
