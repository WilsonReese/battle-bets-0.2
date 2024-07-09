import { StyleSheet, View } from "react-native";
import { Spread } from "./Spread/Spread";
import { OverUnder } from "./OverUnder/OverUnder";
import { useBetContext } from "../contexts/BetContext";
import { Txt } from "../general/Txt";

// I will eventually want to change this so that the enum for bet type
// passes only what we need
export function BetOptions({ game }) {
  const { betOptionType } = useBetContext(); // Use the context

  return (
    <View style={s.container}>
      {betOptionType === "spreadOU" && (
        <View>
          <Spread
            spreadHome={game.spreadHome}
            spreadAway={game.spreadAway}
            spreadPayout={game.spreadPayout}
          />
          <OverUnder ou={game.ou} ouPayout={game.ouPayout} />
        </View>
      )}
      {betOptionType === "moneyLine" && (
        <View>
          <Txt>Money Line Bets</Txt>
        </View>
      )}
      {betOptionType === "prop" && (
        <View>
          <Txt>Prop Bets</Txt>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    // borderWidth: 1,
    paddingTop: 4,
  },
});


// import { StyleSheet, View } from "react-native";
// import { Spread } from "./Spread/Spread";
// import { OverUnder } from "./OverUnder/OverUnder";
// import { MoneyLine } from "./MoneyLine/MoneyLine";
// import { PropBets } from "./PropBets/PropBets";
// import { useBetContext } from "../contexts/BetContext";
// import { Txt } from "../general/Txt";

// export function BetOptions({ game }) {
//   const { betOptionType } = useBetContext(); // Use the context

//   const renderBetOptions = () => {
//     switch (betOptionType) {
//       case "spreadOU":
//         return (
//           <View>
//             <Spread
//               spreadHome={game.spreadHome}
//               spreadAway={game.spreadAway}
//               spreadPayout={game.spreadPayout}
//             />
//             <OverUnder ou={game.ou} ouPayout={game.ouPayout} />
//           </View>
//         );
//       case "moneyLine":
//         return (
//           <MoneyLine
//             moneyLineHome={game.moneyLineHome}
//             moneyLineHomePayout={game.moneyLineHomePayout}
//             moneyLineAway={game.moneyLineAway}
//             moneyLineAwayPayout={game.moneyLineAwayPayout}
//           />
//         );
//       case "prop":
//         return <PropBets propBets={game.propBets} />;
//       default:
//         return null;
//     }
//   };

//   return <View style={s.container}>{renderBetOptions()}</View>;
// }

// const s = StyleSheet.create({
//   container: {
//     paddingTop: 4,
//   },
// });
