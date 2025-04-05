import React from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { Txt } from "../../../components/general/Txt";
import { Btn } from "../../../components/general/Buttons/Btn";

export default function CreatePool() {
  return (
    <View style={s.container}>
      <ScrollView>
        <View>
          <View>
            <Txt style={s.formText}>League Name</Txt>
          </View>
          <View>
            <View style={s.textInputContainer}>
              <TextInput
                style={s.inputText}
                placeholder="Enter League Name"
                placeholderTextColor="#B8C3CC"
                // value={email}
                // onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>
          </View>
          <View>
            <Txt style={s.formText}>Start Week</Txt>
          </View>
          <View>
            <Txt>Dropdown, default to week 1</Txt>
          </View>
          <Btn
            btnText={"Create League"}
            style={s.btn}
            isEnabled={true}
            onPress={() => router.push(`/pools/create/`)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: "#061826",
    padding: 8,
  },
  textInputContainer: {
    paddingVertical: 4,
  },
  inputText: {
    fontFamily: "Saira_600SemiBold",
    borderColor: "#3A454D",
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#F8F8F8",
  },

  formText: {
    color: "#F8F8F8",
    fontSize: 20,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    // margin: 4,
  },
});
