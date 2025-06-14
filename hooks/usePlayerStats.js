import { useMemo } from "react";

export const usePlayerStats = (rawStats) => {
  return useMemo(() => {
    const normalizeGroups = {};
    rawStats.forEach((group) => {
      const key = group.name.toLowerCase().replace(/\s/g, "_");
      normalizeGroups[key] = group;
    });

    const defensiveMap = new Map();

    const addOrUpdatePlayer = (player, fields) => {
      const id = player.player.id;
      if (!defensiveMap.has(id)) {
        defensiveMap.set(id, {
          id,
          name: player.player.name,
          tackles: 0,
          tfl: 0,
          sacks: 0,
          fr: 0,
          int: 0,
          td: 0,
        });
      }

      const entry = defensiveMap.get(id);
      for (const [key, value] of Object.entries(fields)) {
        entry[key] += value ? parseInt(value, 10) || 0 : 0;
      }
    };

    if (normalizeGroups.defensive) {
      normalizeGroups.defensive.players.forEach((player) => {
        const fields = {};
        player.statistics.forEach((s) => {
          if (s.name === "tackles") fields.tackles = s.value;
          if (s.name === "tfl") fields.tfl = s.value;
          if (s.name === "sacks") fields.sacks = s.value;
          if (s.name === "interceptions for touch downs") fields.td = s.value;
        });
        addOrUpdatePlayer(player, fields);
      });
    }

    // need to filter out offensive fumblers
    if (normalizeGroups.fumbles) {
      normalizeGroups.fumbles.players.forEach((player) => {
        const fields = {};
        let shouldAdd = false;

        player.statistics.forEach((s) => {
          if (s.name === "rec" && parseInt(s.value, 10) > 0) {
            fields.fr = s.value;
            shouldAdd = true;
          }
          if (s.name === "rec td" && parseInt(s.value, 10) > 0) {
            fields.td = s.value;
            shouldAdd = true;
          }
        });

        if (shouldAdd) {
          addOrUpdatePlayer(player, fields);
        }
      });
    }

    if (normalizeGroups.interceptions) {
      normalizeGroups.interceptions.players.forEach((player) => {
        const fields = {};
        player.statistics.forEach((s) => {
          if (s.name === "total interceptions") fields.int = s.value;
        });
        addOrUpdatePlayer(player, fields);
      });
    }

    normalizeGroups.defensive = {
      name: "Defensive",
      players: Array.from(defensiveMap.values()).map((player) => ({
        player: { id: player.id, name: player.name },
        statistics: [
          { name: "tackles", value: player.tackles },
          { name: "tfl", value: player.tfl },
          { name: "sacks", value: player.sacks },
          { name: "fr", value: player.fr },
          { name: "int", value: player.int },
          { name: "td", value: player.td },
        ],
      })),
    };

    return normalizeGroups;
  }, [rawStats]);
};
