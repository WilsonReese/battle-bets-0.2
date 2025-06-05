import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../utils/axiosConfig";
import { PreseasonPoolCard } from "./PreseasonPoolCard";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BattleUnlockedPoolCard } from "./BattleUnlockedPoolCard";
import { usePoolDetails } from "../contexts/PoolDetailsContext";
import { BattleLockedPoolCard } from "./BattleLockedPoolCard";

export function PoolCard({ pool }) {
  const [localLoading, setLocalLoading] = useState(false);

  // const [hasStarted, setHasStarted] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    selectedSeason,
    battles,
    userBetslip,
    setUserBetslip,
    userEntry,
    fetchAllPoolData,
    loading: poolLoading,
  } = usePoolDetails(pool.id);

  const latestBattle = battles[0];
  const currentBattle = battles.find(b => b.current === true) || battles[0];

  // useEffect to get standings
  useEffect(() => {
    if (!selectedSeason && !poolLoading) {
      fetchAllPoolData(pool.id);
    }
  }, [pool.id]);

  if (poolLoading || localLoading) {
    return <ActivityIndicator size="small" color="#F8F8F8" />;
  }

  return (
    <TouchableOpacity
      style={s.card}
      onPress={() => router.push(`/pools/${pool.id}/`)}
    >
      <View
        style={s.headingContainer}
        onPress={() => router.push(`/pools/${pool.id}/`)}
      >
        <Txt style={s.heading}>{pool.name}</Txt>
        <FontAwesome6 name="circle-chevron-right" size={18} color="#54D18C" />
      </View>

      {/* League Season has not started, show PreseasonPoolCard */}
      {!pool.has_started && <PreseasonPoolCard pool={pool} />}

      {/* League Season has started and latest battle is unlocked show: BattleUnlockedPoolCard */}
      {pool.has_started && !currentBattle.locked && (
        <BattleUnlockedPoolCard
          pool={pool}
          userEntry={userEntry}
          currentBattle={currentBattle}
          selectedSeason={selectedSeason}
          userBetslip={userBetslip}
          setUserBetslip={setUserBetslip}
          setLoading={setLoading}
        />
      )}

      {/* League Season has started and latest battle is locked, show BattleLockedPoolCard */}
      {pool.has_started && currentBattle.locked && (
        <BattleLockedPoolCard
          pool={pool}
          battle={currentBattle}
          userEntry={userEntry}
          userBetslip={userBetslip}
          
        />
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#0F2638",
    marginVertical: 4,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  headingContainer: {
    flexDirection: "row",
    // backgroundColor: 'blue',
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    paddingVertical: 4,
    fontSize: 18,
  },
  detailsContainer: {
    flexDirection: "row",
    paddingBottom: 8,
  },
  overviewContainer: {
    flex: 3,
    paddingRight: 4,
  },
  currentBattleContainer: {
    flex: 5,
    paddingLeft: 4,
  },

  infoContainer: {
    paddingVertical: 4,
  },

  infoUnitContainer: {
    flexDirection: "row",
  },

  infoTitleTxt: {
    // color: "#061826",
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },

  sectonHeadingTxt: {
    // color: "#061826",
    fontFamily: "Saira_300Light",
    letterSpacing: 2,
    fontSize: 14,
    textTransform: "uppercase",
  },

  txt: {
    // color: "#061826",
    fontSize: 14,
  },

  btn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    // margin: 4,
  },
});
