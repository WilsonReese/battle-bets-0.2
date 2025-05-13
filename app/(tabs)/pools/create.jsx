import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import { useToastMessage } from "../../../hooks/useToastMessage";

const WEEKS = [
  { label: "Week 1", value: 1 },
  { label: "Week 2", value: 2 },
  { label: "Week 3", value: 3 },
  { label: "Week 4", value: 4 },
  { label: "Week 5", value: 5 },
  { label: "Week 6", value: 6 },
  { label: "Week 7", value: 7 },
  { label: "Week 8", value: 8 },
  { label: "Week 9", value: 9 },
  { label: "Week 10", value: 10 },
  { label: "Week 11", value: 11 },
  { label: "Week 12", value: 12 },
  { label: "Week 13", value: 13 },
  { label: "Week 14", value: 14 },
];

export default function CreatePool() {
  const bottomSheetRef = useRef(null);
  const [selectedWeek, setSelectedWeek] = useState(WEEKS[0]);
  const [leagueName, setLeagueName] = useState("");
  const {  showError, showSuccess } = useToastMessage();
  const { poolId } = useLocalSearchParams();
  const isEditMode = !!poolId;

  const handleSelectWeek = (week) => {
    setSelectedWeek(week);
    bottomSheetRef.current?.close();
  };

  const handleSubmit = async () => {
    if (!leagueName.trim()) {
      showError("Please enter a league name.");
      return;
    }
  
    try {
      if (isEditMode) {
        await api.patch(`/pools/${poolId}`, {
          name: leagueName,
          start_week: selectedWeek.value,
        });
        showSuccess("League updated successfully.");
      } else {
        await api.post("/pools", {
          name: leagueName,
          start_week: selectedWeek.value,
        });
        showSuccess("League created successfully.");
      }
  
      router.back();
    } catch (error) {
      console.error("Failed to submit league:", error?.response?.data || error.message);
      showError("Something went wrong.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (isEditMode) {
        const poolRes = await api.get(`/pools/${poolId}`);
        const leagueSeasonsRes = await api.get(`/pools/${poolId}/league_seasons`);
  
        setLeagueName(poolRes.data.name);
        const currentSeason = leagueSeasonsRes.data.find(ls => ls.season.year === 2024); // adjust logic as needed
        if (currentSeason) {
          const weekOption = WEEKS.find(w => w.value === currentSeason.start_week);
          if (weekOption) setSelectedWeek(weekOption);
        }
      }
    };
  
    loadData();
  }, []);


  return (
    <View style={s.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
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
                <Txt style={s.responseTxt}>{selectedWeek.label}</Txt>
                <FontAwesome6 name="chevron-down" size={16} color="#F8F8F8" />
              </View>
            </TouchableOpacity>

            <Btn
              style={s.btn}
              btnText={isEditMode ? "Save Changes" : "Create League"}
              onPress={handleSubmit}
              isEnabled={true}
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
              key={week.value}
              style={s.radioItem}
              onPress={() => handleSelectWeek(week)}
            >
              <View style={s.radioCircle}>
                {selectedWeek.value === week.value && (
                  <View style={s.radioSelected} />
                )}
              </View>
              <Txt style={s.radioLabel}>{week.label}</Txt>
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
