import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Txt } from "../general/Txt";

function parseTimeToSeconds(timeStr) {
  const [minutes, seconds] = timeStr.split(":").map(Number);
  return minutes * 60 + seconds;
}

export function TeamData({ awayStats, homeStats }) {
  const awaySeconds = parseTimeToSeconds(awayStats.posession.total);
  const homeSeconds = parseTimeToSeconds(homeStats.posession.total);
  const totalSeconds = awaySeconds + homeSeconds;

  const awayFlex = awaySeconds / totalSeconds;
  const homeFlex = homeSeconds / totalSeconds;

  return (
    <View style={s.container}>
      <View style={s.statValuesRow}>
        <Txt>{awayStats.posession.total}</Txt>
        <Txt>Time of Possession</Txt>
        <Txt>{homeStats.posession.total}</Txt>
      </View>
      <View style={s.bar}>
        <View style={[s.awayPortion, s.selectedPortion, { flex: awayFlex }]} />
        <View
          style={[s.homePortion, s.unselectedPortion, { flex: homeFlex }]}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: "#0F2638",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  bar: {
    height: 8,
    flex: 1,
    // backgroundColor: '#061826',
    borderRadius: 50,
    flexDirection: "row",
    gap: 6,
  },
  awayPortion: {
    // flex: 1,
    // backgroundColor: '#54D18C',
    borderRadius: 50,
  },
  homePortion: {
    // flex: 2,
    // backgroundColor: '#F8F8F8',
    borderRadius: 50,
  },
  selectedPortion: {
    backgroundColor: "#54D18C",
  },
  unselectedPortion: {
    backgroundColor: "#B8C3CC",
  },
  statValuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});

// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import { Txt } from "../general/Txt";

// export function TeamData({ awayStats, homeStats }) {
//   return (
//     <View style={s.container}>
//       <Txt style={s.headingTxt}>Team Stats</Txt>
//       <View style={s.statGroup}>
//         <View style={s.statNameContainer}>
//           <Txt style={s.statNameTxt}>Yards</Txt>
//         </View>
//         <View style={s.statsContainer}>
//           <View style={s.statBlock}>
//             <Txt style={s.headerRowTxt}>Total</Txt>
//             <Txt style={s.statTxt}>{stats.yards.total}</Txt>
//           </View>
//           <View style={s.statBlock}>
//             <Txt style={s.headerRowTxt}>Passing</Txt>
//             <Txt style={s.statTxt}>{stats.passing.total}</Txt>
//           </View>
//           <View style={s.statBlock}>
//             <Txt style={s.headerRowTxt}>Rushing</Txt>
//             <Txt style={s.statTxt}>{stats.rushings.total}</Txt>
//           </View>
//         </View>
//       </View>

//       <View style={s.statGroup}>
//         <View style={s.statNameContainer}>
//           <Txt style={s.statNameTxt}>Turnovers</Txt>
//         </View>
//         <View style={s.statsContainer}>
//           <View style={s.statBlock}>
//             <Txt style={s.headerRowTxt}>Total</Txt>
//             <Txt style={s.statTxt}>{stats.turnovers.total}</Txt>
//           </View>
//           <View style={s.statBlock}>
//             <Txt style={s.headerRowTxt}>INTs</Txt>
//             <Txt style={s.statTxt}>{stats.turnovers.interceptions}</Txt>
//           </View>
//           <View style={s.statBlock}>
//             <Txt style={s.headerRowTxt}>Fumbles</Txt>
//             <Txt style={s.statTxt}>{stats.turnovers.lost_fumbles}</Txt>
//           </View>
//         </View>
//       </View>

//       <View style={s.statGroup}>
//         <View style={s.statNameContainer}>
//           <Txt style={s.statNameTxt}>First Downs</Txt>
//         </View>
//         <View style={s.statsContainer}>
//           <View style={s.statBlock}>
//             <Txt style={s.headerRowTxt}>Total</Txt>
//             <Txt style={s.statTxt}>{stats.first_downs.total}</Txt>
//           </View>
//           <View style={s.statBlock}>
//             <Txt style={s.headerRowTxt}>3rd %</Txt>
//             <Txt style={s.statTxt}>
//               {stats.first_downs.third_down_efficiency}
//             </Txt>
//           </View>
//           <View style={s.statBlock}>
//             <Txt style={s.headerRowTxt}>4th %</Txt>
//             <Txt style={s.statTxt}>
//               {stats.first_downs.fourth_down_efficiency}
//             </Txt>
//           </View>
//         </View>
//       </View>

//       <View style={s.statGroup}>
//         <View style={s.statNameContainer}>
//           <Txt style={s.statNameTxt}>Defense</Txt>
//         </View>
//         <View style={s.statsContainer}>
//           <View style={s.statBlock}>
//             <Txt style={s.headerRowTxt}>Sacks</Txt>
//             <Txt style={s.statTxt}>{stats.sacks.total}</Txt>
//           </View>
//           <View style={s.statBlock}>
//             <Txt style={s.headerRowTxt}>Safeties</Txt>
//             <Txt style={s.statTxt}>{stats.safeties.total}</Txt>
//           </View>
//         </View>
//       </View>

//       <View style={[s.statGroup, s.timeOfPossession]}>
//         <Txt style={[s.statNameTxt, s.statNameContainer]}>
//           Time of Possession
//         </Txt>
//         <Txt style={[s.statTxt, s.statsContainer]}>{stats.posession.total}</Txt>
//       </View>
//     </View>
//   // );
// }

// const s = StyleSheet.create({
//   container: {
//     backgroundColor: "#0F2638",
//     borderRadius: 8,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     marginTop: 12,
//     marginBottom: 4,
//   },
//   headingTxt: {
//     fontSize: 16,
//     fontFamily: "Saira_600SemiBold",
//     paddingVertical: 4,
//     color: "#54D18C",
//   },
//   statGroup: {
//     flexDirection: "row",
//     paddingVertical: 8,
//   },
//   statNameContainer: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   statNameTxt: {
//     fontFamily: "Saira_600SemiBold",
//   },
//   statsContainer: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   statBlock: {
//     alignItems: "center",
//   },
//   headerRowTxt: {
//     color: "#F8F8F8",
//     // flex: 1,
//     fontFamily: "Saira_600SemiBold",
//     fontSize: 12,
//   },
//   statTxt: {
//     fontSize: 14,
//     color: "#C7CDD1",
//   },
//   timeOfPossession: {
//     flexDirection: "row",
//   },
// });
