import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../../utils/axiosConfig";
import { PreseasonPoolCard } from "./PreseasonPoolCard";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { BattleUnlockedPoolCard } from "./BattleUnlockedPoolCard";
// import { usePoolDetails } from "../contexts/PoolDetailsContext";
import { BattleLockedPoolCard } from "./BattleLockedPoolCard";
import { SkeletonPoolCard } from "./SkeletonPoolCard";
import { usePoolStore } from "../../state/poolStore";
import shallow from 'zustand/shallow';

const EMPTY_POOL = {
  loading: true,
  details:  null,
  battles:  [],
  userBetslipByBattle: {},
  userEntry: null,
};

// export function PoolCard({ pool, focusVersion }) {
export const PoolCard = React.memo(function PoolCard({ pool, refreshing }) {
	// const [localLoading, setLocalLoading] = useState(false);
	// const [cardLoading, setCardLoading] = useState(false);

	const fetchAllPoolData = usePoolStore((s) => s.fetchAllPoolData);

  // const { loading, details, battles, userBetslipByBattle, userEntry } =
  //   usePoolStore(
  //     (s) => s.pools[pool.id] || {
  //       loading: true,
  //       details: null,
  //       battles: [],
  //       userBetslipByBattle: {},
  //       userEntry: null,
  //     },
  //     // shallow compare so we only rerender if one of these actually changes
  //     (a, b) =>
  //       a.loading === b.loading &&
  //       a.details === b.details &&
  //       a.battles === b.battles &&
  //       a.userEntry === b.userEntry
  //   );

	  const {
    loading,
    details,
    battles,
    userBetslipByBattle,
    userEntry
  } = usePoolStore(
    state => state.pools[pool.id] ?? EMPTY_POOL,
    shallow
  );

  useEffect(() => {
    if (!details) {
      fetchAllPoolData(pool.id, { skipLoading: true });
    }
  }, [details, pool.id, fetchAllPoolData]);

	useEffect(() => {
    if (refreshing) {
      fetchAllPoolData(pool.id, { skipLoading: false });
    }
  }, [refreshing, pool.id, fetchAllPoolData]);

	// const [hasStarted, setHasStarted] = useState(null);
	// const [loading, setLoading] = useState(false);
	// const {
	// 	selectedSeason,
	// 	// battles,
	// 	// userBetslip,
	// 	userBetslipByBattle, // ✅ ADD THIS
	// 	setUserBetslip,
	// 	userEntry,
	// 	// fetchAllPoolData,
	// 	// loading: poolLoading,
	// } = usePoolDetails(pool.id);

	if (!details) return <SkeletonPoolCard />;

	const currentBattle =
		battles.find((b) => b.current === true) || battles[0] || null;

	// console.log("Selected Season: ", selectedSeason);
	console.log("Pool ID", pool.id);

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
			{pool.has_started && currentBattle && !currentBattle.locked && (
				<BattleUnlockedPoolCard
					pool={pool}
					userEntry={userEntry}
					currentBattle={currentBattle}
					selectedSeason={details.selectedSeason}
					userBetslip={userBetslipByBattle?.[currentBattle?.id] ?? null}
					// setUserBetslip={setUserBetslip}
					// setLoading={setLoading}
				/>
			)}

			{/* League Season has started and latest battle is locked, show BattleLockedPoolCard */}
			{pool.has_started && currentBattle && currentBattle.locked && (
				<BattleLockedPoolCard
					pool={pool}
					battle={currentBattle}
					userEntry={userEntry}
					userBetslip={userBetslipByBattle?.[currentBattle?.id] ?? null}
				/>
			)}
			{loading && (
				<View
					style={{
						// ...StyleSheet.absoluteFillObject,
						position: 'absolute',
						bottom: 8,
						right: 8,
						// backgroundColor: "rgba(0,0,0,0.3)",
						// justifyContent: "center",
						// alignItems: "center",
						// borderRadius: 8, // match your card corners
					}}
				>
					<ActivityIndicator size="small" color="#425C70" />
				</View>
			)}
		</TouchableOpacity>
	);
})

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
