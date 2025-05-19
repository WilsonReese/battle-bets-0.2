import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../components/general/Txt";
import { router } from "expo-router";


export default function PasswordReset() {


  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <Txt>Test</Txt>
        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Txt>Back to login</Txt>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#061826",
  },
});
