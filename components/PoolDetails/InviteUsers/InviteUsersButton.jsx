import { StyleSheet, TouchableOpacity } from "react-native";
import { Txt } from "../../general/Txt";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as Clipboard from 'expo-clipboard';
import { useToastMessage } from "../../../hooks/useToastMessage";

export function InviteUsersButton({ poolId, inviteToken }) {
  const { showSuccess, showError } = useToastMessage();

  const handleCopyLink = async () => {
    const link = `battlebets://join?pool_id=${poolId}&token=${inviteToken}`;
    await Clipboard.setStringAsync(link);
    showSuccess("Invitation link copied!");
  };

  return (
    <>
      <TouchableOpacity style={s.button} onPress={handleCopyLink}>
        <Txt>Copy League Invitation Link</Txt>
        <FontAwesome6 name="link" size={16} color="#54D18C" />
      </TouchableOpacity>
    </>
  );
}

const s = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
    gap: 8,
    // backgroundColor: 'green'
  },

});
