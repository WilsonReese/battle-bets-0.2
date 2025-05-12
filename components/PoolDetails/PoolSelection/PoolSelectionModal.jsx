import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import { Txt } from "../../general/Txt";

export function PoolSelectionModal({ modalVisible, userPools, setModalVisible }) {

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
            {userPools.map((pool) => (
              <TouchableOpacity
                key={pool.id}
                onPress={() => {
                  setModalVisible(false);
                  router.replace(`/pools/${pool.id}`);
                }}
                style={s.poolItem}
              >
                <Txt style={s.poolName}>{pool.name}</Txt>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 9,
    // padding: 20,
    width: "80%",
  },
  poolName: {
    color: '#061826'
  }
});
