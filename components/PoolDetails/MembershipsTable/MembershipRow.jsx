import { Modal, StyleSheet, View } from "react-native";
import { Txt } from "../../general/Txt";
import { Btn } from "../../general/Buttons/Btn";
import { useState } from "react";
import api from "../../../utils/axiosConfig";
import { EditMemberModal } from "./EditMemberModal";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { formatMembershipJoinDate } from "../../../utils/dateUtils";

export function MembershipRow({
  member,
  isLast,
  poolId,
  onRemove,
  fetchPoolMemberships,
  isCurrentUserCommissioner,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View
        key={member.id}
        style={[s.container, !isLast && s.withBottomBorder]}
      >
        <View style={s.leftSection}>
          <View style={s.name}>
            <Txt style={s.txt}>
              {member.user.first_name} {member.user.last_name}
            </Txt>
            {member.is_commissioner && (
              <FontAwesome6
                name="crown"
                size={16}
                color="#54D18C"
                style={{ paddingLeft: 4, paddingBottom: 3 }}
              />
            )}
          </View>
          <Txt style={s.detailsTxt}>@{member.user.username}</Txt>
        </View>

        <View style={s.rightSection}>
          <View style={{ alignItems: "flex-end" }}>
            <Txt style={s.txt}>Joined</Txt>
            <Txt style={s.detailsTxt}>
              {formatMembershipJoinDate(member.created_at)}
            </Txt>
          </View>
          {isCurrentUserCommissioner && (
            <View style={s.removeButtonContainer}>
              <Btn
                btnText={"Edit"}
                style={s.btn}
                isEnabled={true}
                fontSize={12}
                fontColor={"#54D18C"}
                onPress={() => setModalVisible(true)}
              />
            </View>
          )}
        </View>
      </View>

      <EditMemberModal
        member={member}
        poolId={poolId}
        onRemove={onRemove}
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onChange={fetchPoolMemberships}
      />
    </>
  );
}

const s = StyleSheet.create({
  container: {
    paddingTop: 2,
    paddingBottom: 4,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
  },
  name: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  withBottomBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#3A454D",
  },
  txt: {
    color: "#F8F8F8",
    fontSize: 14
  },
  usernameContainer: {
    marginTop: -4,
  },
  detailsTxt: {
    color: "#B8C3CC",
    fontSize: 11,
    fontFamily: "Saira_400Regular_Italic",
    marginTop: -4,
  },
  removeButtonContainer: {
    paddingLeft: 12,
  },
  btn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#54D18C",
    paddingHorizontal: 12,
  },
});
