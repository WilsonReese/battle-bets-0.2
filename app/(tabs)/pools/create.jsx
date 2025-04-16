import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Txt } from "../../../components/general/Txt";
import { Btn } from "../../../components/general/Buttons/Btn";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import api from "../../../utils/axiosConfig";
import { router } from "expo-router";
import { Message } from "../../../components/general/Message";

const WEEKS = [
  "Week 1",
  "Week 2",
  "Week 3",
  "Week 4",
  "Week 5",
  "6",
  "7",
  "Week 8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
];

export default function CreatePool() {
  const bottomSheetRef = useRef(null);
  const [selectedWeek, setSelectedWeek] = useState("Week 1");
  const [leagueName, setLeagueName] = useState("");
  const [message, setMessage] = useState(null); // Add state for message

  const showMessage = (text, color) => {
    setMessage({ text, color });
  };

  const handleSelectWeek = (week) => {
    setSelectedWeek(week);
    bottomSheetRef.current?.close();
  };

  const handleCreateLeague = async () => {
    if (!leagueName.trim()) {
      showMessage("Please enter a league name.", "#AB1126");
      return;
    }

    try {
      const response = await api.post("/pools", {
        name: leagueName,
      });

      console.log("Pool created:", response.data);
      // You can optionally route to the new pool here:
      router.replace({
        pathname: "/pools",
        params: { successMessage: "League created successfully." },
      });
    } catch (error) {
      console.error(
        "Failed to create league:",
        error?.response?.data || error.message
      );
      showMessage("Failed to create league.", "#AB1126");
    }
  };

  return (
    <View style={s.container}>
      {message && (
        <Message
          message={message.text}
          color={message.color}
          onHide={() => setMessage(null)} // Hide message after duration
          location={0}
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} keyboardShouldPersistTaps='handled'>
          <View>
            <Txt style={s.formText}>League Name</Txt>
            <View style={s.textInputContainer}>
              <TextInput
                style={s.inputText}
                placeholder="Enter League Name"
                placeholderTextColor="#B8C3CC"
                value={leagueName}
                onChangeText={setLeagueName}
                autoCapitalize="none"
              />
            </View>

            <Txt style={s.formText}>Start Week</Txt>
            <TouchableOpacity
              style={s.weekSelector}
              onPress={() => bottomSheetRef.current?.expand()}
            >
              <View style={s.weekSelectorView}>
                <Txt style={s.responseTxt}>{selectedWeek}</Txt>
                <FontAwesome6 name="chevron-down" size={16} color="#F8F8F8" />
              </View>
            </TouchableOpacity>

            <Btn
              btnText={"Create League"}
              style={s.btn}
              isEnabled={true}
              onPress={handleCreateLeague}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        // snapPoints={snapPoints}
        enablePanDownToClose
        maxDynamicContentSize={320}
        backgroundStyle={{ backgroundColor: "#F8F8F8" }}
        handleIndicatorStyle={{ backgroundColor: "#061826" }} // the top little "handle" bar
      >
        <BottomSheetScrollView style={s.sheetContainer}>
          {WEEKS.map((week) => (
            <TouchableOpacity
              key={week}
              style={s.radioItem}
              onPress={() => handleSelectWeek(week)}
            >
              <View style={s.radioCircle}>
                {selectedWeek === week && <View style={s.radioSelected} />}
              </View>
              <Txt style={s.radioLabel}>{week}</Txt>
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 24,
  },
  weekSelector: {
    // backgroundColor: "#DAE1E5",
    borderWidth: 1,
    borderColor: "#3A454D",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  weekSelectorView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  responseTxt: {
    fontFamily: "Saira_600SemiBold",
    fontSize: 14,
  },
  sheetContainer: {
    padding: 16,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#061826",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#061826",
  },
  radioLabel: {
    fontSize: 16,
    color: "#061826",
  },
});
