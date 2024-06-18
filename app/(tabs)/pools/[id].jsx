import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from "expo-router";

export default function PoolPage() {
  const { id } = useLocalSearchParams();
  
    return (
    <>
      <View >
		<StatusBar style="dark" />
        <Text>Make picks for pool {id}</Text>
      </View>
    </>
  );
}

const s = StyleSheet.create({

});
