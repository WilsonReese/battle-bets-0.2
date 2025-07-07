import React, { useRef } from "react";
import { Animated, Dimensions, FlatList, StyleSheet, View } from "react-native";

export function PaginatedFlatList({
  data = [],
  itemsPerPage = 1,
  containerWidth = Dimensions.get("window").width,
  renderItemRow, // Function that renders a single item
  keyExtractor = (item, index) => `item-${index}`,
  isComponentPages = false, // <-- NEW
}) {
  const PAGE_WIDTH = containerWidth;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const pages = Math.ceil(data.length / itemsPerPage);

  const groupedData = isComponentPages
    ? data
    : Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, i) =>
        data.slice(i * itemsPerPage, (i + 1) * itemsPerPage)
      );

  return (
    <View>
      <Animated.FlatList
        ref={flatListRef}
        data={groupedData}
        keyExtractor={(_, i) => `page-${i}`}
        renderItem={({ item, index }) => (
          <View style={{ width: PAGE_WIDTH }} key={`page-${index}`}>
            {isComponentPages
              ? renderItemRow(item, index, 1) // Treat as component
              : item.map((entry, subIndex) =>
                  renderItemRow(entry, subIndex, item.length)
                )}
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

      {pages > 1 && (
        <View style={s.dotScrollContainer}>
          <Animated.View
            style={[
              s.dotsWrapper,
              {
                transform: [
                  {
                    translateX: scrollX.interpolate({
                      inputRange: [
                        0,
                        PAGE_WIDTH * (groupedData.length - 1),
                      ],
                      outputRange: [
                        0,
                        -((8 + 12) * (groupedData.length - 1)) / 2,
                      ],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              },
            ]}
          >
            {groupedData.map((_, i) => {
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
