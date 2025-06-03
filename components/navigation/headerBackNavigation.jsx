import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Txt } from "../general/Txt";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export function HeaderBackNavigation({  }) {

  return (
    <TouchableOpacity style={s.container} onPress={() => router.back()}>
      <FontAwesome6 name="chevron-left" size={20} color="#F8F8F8" />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: 'green',
    paddingRight: 20,
    paddingVertical: 2,
  },
});
