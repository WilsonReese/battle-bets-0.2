import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import { Txt } from "../../general/Txt";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function PoolSelectionModal({
  modalVisible,
  userPools,
  setModalVisible,
  currentPoolId,
}) {
  return (
    <>
      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <TouchableOpacity
          style={s.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={s.modalContainer}
            onPress={() => {}} // prevents propagation to outer overlay
          >
            <TouchableOpacity
              style={s.closeModalContainer}
              onPress={() => setModalVisible(false)}
            >
              <FontAwesome6 name="x" size={18} color="#54D18C" />
            </TouchableOpacity>
            <ScrollView style={s.poolsContainer}>
              {userPools.map((pool) => (
                <TouchableOpacity
                  key={pool.id}
                  onPress={() => {
                    setModalVisible(false);
                    if (currentPoolId != pool.id) {
                      router.replace(`/pools/${pool.id}`);
                    }
                  }}
                  style={s.poolItem}
                >
                  <Txt
                    style={[
                      s.poolName,
                      pool.id == currentPoolId && s.currentPoolName,
                    ]}
                  >
                    {pool.name}
                  </Txt>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 9,
    // padding: 20,
    width: "80%",
  },
  closeModalContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: "flex-end",
  },
  poolsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  poolItem: {
    // borderBottomWidth: 1,
    paddingVertical: 8,
    borderBottomColor: "#ccc",
  },
  poolName: {
    // fontSize: 18,
    // fontFamily: "Saira_600SemiBold",
    color: "#061826",
  },
  currentPoolName: {
    fontFamily: "Saira_600SemiBold",
    color: '#54D18C'
  }
});
