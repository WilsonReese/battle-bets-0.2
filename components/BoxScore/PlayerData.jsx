// import { StyleSheet, View } from "react-native";
// import { Txt } from "../general/Txt";

// const STAT_GROUPS = [
//   "passing",
//   "rushing",
//   "receiving",
//   "defensive",
//   "kick_returns",
//   "kicking",
//   "punting",
//   "punt_returns",
// ];

// const DISPLAY_STATS = {
//   passing: {
//     "comp att": "C/ATT",
//     yards: "Yards",
//     "passing touch downs": "TD",
//     interceptions: "INT",
//   },
//   rushing: {
//     total: "ATT",
//     yards: "YDS",
//     average: "AVG",
//     "rushing touch downs": "TD",
//   },
//   receiving: {
//     receptions: "REC",
//     yards: "YDS",
//     average: "AVG",
//     "receiving touch downs": "TD",
//   },
//   kicking: {
//     "field goals": "FG",
//     long: "LONG",
//     "extra point": "XP",
//   },
//   punting: {
//     total: "NO",
//     yards: "YDS",
//     average: "AVG",
//     touchbacks: "TB",
//   },
//   kick_returns: {
//     total: "NO",
//     yards: "YDS",
//     average: "AVG",
//     "kick return td": "TD",
//   },
//   punt_returns: {
//     total: "NO",
//     yards: "YDS",
//     average: "AVG",
//     "punt return td": "TD",
//   },
//   defensive: {
//     tackles: "TOT",
//     tfl: "TFL",
//     sacks: "SACKS",
//     fr: "FR", // custom-added
//     int: "INT", // custom-added
//     td: "TD", // custom-added
//   },
// };

// export function PlayerData({ stats }) {
//   // --- Step 1: Normalize group names ---
//   const normalizeGroups = {};
//   stats.forEach((group) => {
//     const key = group.name.toLowerCase().replace(/\s/g, "_");
//     normalizeGroups[key] = group;
//   });

//   // --- Step 2: Build merged defensive group ---
//   const defensiveMap = new Map();

//   const addOrUpdatePlayer = (player, fields) => {
//     const id = player.player.id;
//     if (!defensiveMap.has(id)) {
//       defensiveMap.set(id, {
//         id,
//         name: player.player.name,
//         tackles: 0,
//         tfl: 0,
//         sacks: 0,
//         fr: 0,
//         int: 0,
//         td: 0,
//       });
//     }

//     const entry = defensiveMap.get(id);
//     for (const [key, value] of Object.entries(fields)) {
//       entry[key] += value ? parseInt(value, 10) || 0 : 0;
//     }
//   };

//   // Add from Defensive group
//   if (normalizeGroups.defensive) {
//     normalizeGroups.defensive.players.forEach((player) => {
//       const fields = {};
//       player.statistics.forEach((s) => {
//         if (s.name === "tackles") fields.tackles = s.value;
//         if (s.name === "tfl") fields.tfl = s.value;
//         if (s.name === "sacks") fields.sacks = s.value;
//         if (s.name === "interceptions for touch downs") fields.td = s.value;
//       });
//       addOrUpdatePlayer(player, fields);
//     });
//   }

//   // Add from Fumbles group
//   if (normalizeGroups.fumbles) {
//     normalizeGroups.fumbles.players.forEach((player) => {
//       const fields = {};
//       player.statistics.forEach((s) => {
//         if (s.name === "rec") fields.fr = s.value;
//         if (s.name === "rec td") fields.td = s.value;
//       });
//       addOrUpdatePlayer(player, fields);
//     });
//   }

//   // Add from Interceptions group
//   if (normalizeGroups.interceptions) {
//     normalizeGroups.interceptions.players.forEach((player) => {
//       const fields = {};
//       player.statistics.forEach((s) => {
//         if (s.name === "total interceptions") fields.int = s.value;
//       });
//       addOrUpdatePlayer(player, fields);
//     });
//   }

//   // --- Step 3: Override the defensive group with the merged one ---
//   const mergedDefensiveGroup = {
//     name: "Defensive",
//     players: Array.from(defensiveMap.values()).map((player) => ({
//       player: { id: player.id, name: player.name },
//       statistics: [
//         { name: "tackles", value: player.tackles },
//         { name: "tfl", value: player.tfl },
//         { name: "sacks", value: player.sacks },
//         { name: "fr", value: player.fr },
//         { name: "int", value: player.int },
//         { name: "td", value: player.td },
//       ],
//     })),
//   };

//   normalizeGroups.defensive = mergedDefensiveGroup;

//   const renderStatGroup = (groupName) => {
//     const group = normalizeGroups[groupName];

//     if (!group) {
//       return <Txt key={groupName}>No stats for {groupName.replace(/_/g, " ")}</Txt>;
//     }

//     const statLabelMap = DISPLAY_STATS[groupName];

//     return (
//       <View key={groupName} style={s.groupContainer}>
//         <Txt style={s.groupTitle}>{group.name}</Txt>
//         {group.players.map((player) => (
//           <View key={player.player.id} style={s.playerContainer}>
//             <Txt style={s.playerName}>{player.player.name}</Txt>
//             {player.statistics
//               .filter((stat) =>
//                 statLabelMap ? Object.keys(statLabelMap).includes(stat.name) : true
//               )
//               .map((stat, index) => (
//                 <Txt key={index} style={s.statLine}>
//                   {(statLabelMap && statLabelMap[stat.name]) || stat.name}:{" "}
//                   {stat.value ?? "N/A"}
//                 </Txt>
//               ))}
//           </View>
//         ))}
//       </View>
//     );
//   };

//   return <View>{STAT_GROUPS.map((groupName) => renderStatGroup(groupName))}</View>;
// }

// const s = StyleSheet.create({
//   groupContainer: {
//     marginBottom: 16,
//   },
//   groupTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 4,
//     color: "#54D18C",
//   },
//   playerContainer: {
//     marginLeft: 12,
//     marginBottom: 8,
//   },
//   playerName: {
//     fontWeight: "600",
//     marginBottom: 2,
//     color: "#F8F8F8",
//   },
//   statLine: {
//     marginLeft: 8,
//     color: "#B8C3CC",
//   },
// });

import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { usePlayerStats } from "../../hooks/usePlayerStats"; // adjust import path

const STAT_GROUPS = [
  "passing",
  "rushing",
  "receiving",
  "defensive",
  "kick_returns",
  "kicking",
  "punting",
  "punt_returns",
];

const DISPLAY_STATS = {
  passing: {
    "comp att": "C/ATT",
    yards: "Yards",
    "passing touch downs": "TD",
    interceptions: "INT",
  },
  rushing: {
    total: "ATT",
    yards: "YDS",
    average: "AVG",
    "rushing touch downs": "TD",
  },
  receiving: {
    receptions: "REC",
    yards: "YDS",
    average: "AVG",
    "receiving touch downs": "TD",
  },
  kicking: { "field goals": "FG", long: "LONG", "extra point": "XP" },
  punting: { total: "NO", yards: "YDS", average: "AVG", touchbacks: "TB" },
  kick_returns: {
    total: "NO",
    yards: "YDS",
    average: "AVG",
    "kick return td": "TD",
  },
  punt_returns: {
    total: "NO",
    yards: "YDS",
    average: "AVG",
    "punt return td": "TD",
  },
  defensive: {
    tackles: "TOT",
    tfl: "TFL",
    sacks: "SACKS",
    fr: "FR",
    int: "INT",
    td: "TD",
  },
};

export function PlayerData({ stats }) {
  const normalizedGroups = usePlayerStats(stats);

  const renderStatGroup = (groupName) => {
    const group = normalizedGroups[groupName];
    if (!group) {
      return (
        <Txt key={groupName}>No stats for {groupName.replace(/_/g, " ")}</Txt>
      );
    }

    const statLabelMap = DISPLAY_STATS[groupName];
    return (
      <View key={groupName} style={s.groupContainer}>
        <Txt style={s.groupTitle}>{group.name}</Txt>
        {group.players.map((player) => (
          <View key={player.player.id} style={s.playerContainer}>
            <Txt style={s.playerName}>{player.player.name}</Txt>
            {player.statistics
              .filter((stat) => statLabelMap?.[stat.name])
              .map((stat, index) => (
                <Txt key={index} style={s.statLine}>
                  {statLabelMap[stat.name]}: {stat.value ?? "N/A"}
                </Txt>
              ))}
          </View>
        ))}
      </View>
    );
  };

  return <View>{STAT_GROUPS.map(renderStatGroup)}</View>;
}

const s = StyleSheet.create({
  groupContainer: { marginBottom: 16 },
  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#54D18C",
  },
  playerContainer: { 
    marginLeft: 12, 
    marginBottom: 8 
  },
  playerName: { 
    fontWeight: "600", 
    marginBottom: 2, 
    color: "#F8F8F8" 
  },
  statLine: { 
    marginLeft: 8, 
    color: "#B8C3CC" 
  },
});
