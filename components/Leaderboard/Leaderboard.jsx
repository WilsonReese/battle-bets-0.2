import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Row } from "./Row";
import { useEffect, useState } from "react";
import api from "../../utils/axiosConfig";
import { LoadingIndicator } from "../general/LoadingIndicator";

export function Leaderboard({ userBetslip, poolId, battle }) {
  const [betslips, setBetslips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch and sort betslips on component mount
  useEffect(() => {
    const fetchBetslips = async () => {
      try {
        const response = await api.get(
          `/pools/${poolId}/battles/${battle.id}/betslips`
        );

        // Sort by earnings descending, then by max_payout_remaining descending
        const sortedBetslips = response.data.sort((a, b) => {
          if (b.earnings !== a.earnings) {
            return b.earnings - a.earnings;
          }
          return b.max_payout_remaining - a.max_payout_remaining;
        });

        setBetslips(sortedBetslips);
      } catch (error) {
        console.error("Error fetching betslips:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    fetchBetslips();
  }, [poolId, battle.id]);

  function renderBetslipRows() {
    return betslips.map((betslip, index) => {
      const isUserBetslip = betslip.id === userBetslip.id;
      const backgroundColor = isUserBetslip
        ? "#5996FF" // Special color for user's betslip
        : index % 2 === 0
        ? "#F8F8F8" // Alternate colors for other betslips
        : "#DAE1E5";

      return (
        <View key={betslip.id}>
          <Row
            betslip={betslip}
            poolId={poolId}
            battle={battle}
            backgroundColor={backgroundColor}
          />
        </View>
      );
    });
  }

  if (loading) {
    return (
      <View style={s.container}>
        <LoadingIndicator color="dark" contentToLoad="betslips" />
      </View>
    );
  }

  return (
    <View>
      <View style={s.container}>
        <View style={s.firstHeaderElement}>
          <Txt style={s.headerTxt}>Player</Txt>
        </View>
        <View style={s.headerElement}>
          <Txt style={s.headerTxt}>Won</Txt>
        </View>
        <View style={s.headerElement}>
          <Txt style={s.headerTxt}>Max</Txt>
        </View>
        <View style={s.headerElement} />
      </View>

      {/* Betslips are locked: show the other betslips for the battle */}
      {userBetslip.locked && <View>{renderBetslipRows()}</View>}

      {/* Betslips are not locked */}
      {!userBetslip.locked && (
        <View style={s.leaderboardWhenLocked}>
          <View>
            <Row betslip={userBetslip} poolId={poolId} battle={battle} />
          </View>
          <View style={s.hiddenBetslips}>
            <Txt style={s.txt}>Other betslips hidden until games start</Txt>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "black",
    // flex: 1,
  },
  firstHeaderElement: {
    flex: 1.75,
    // alignItems: 'center',
  },
  headerElement: {
    flex: 1,
    alignItems: "center",
  },
  headerTxt: {
    fontFamily: "Saira_600SemiBold",
    color: "#061826",
    fontSize: 16,
    // textAlign: "center",
  },
  txt: {
    fontFamily: "Saira_400Regular_Italic",
    color: "#061826",
    fontSize: 14,
    // textAlign: "center",
  },
  hiddenBetslips: {
    alignItems: "center",
    paddingVertical: 4,
  },
  leaderboardWhenLocked: {
    borderWidth: 1,
    borderColor: "black",
    marginVertical: 4,
  },
});
