import { StyleSheet, View } from "react-native";
import { Txt } from "../general/Txt";
import { Btn } from "../general/Buttons/Btn";

export function MembershipRow({ member, isLast }) {
  return (
    <View key={member.id} style={[s.container, !isLast && s.withBottomBorder]}>
      <View style={s.leftSection}>
        <Txt style={s.txt}>
          {member.user.first_name} {member.user.last_name}
        </Txt>
        <Txt style={s.detailsTxt}>@{member.user.username}</Txt>
      </View>

      <View style={s.rightSection}>
        <View>
          <Txt>Joined</Txt>
          <Txt style={s.detailsTxt}>2025</Txt>
        </View>
        <View style={s.removeButtonContainer}>
          <Btn
            btnText={'Remove'}
            style={s.btn}
            isEnabled={true}
            fontSize={14}
            fontColor={"#E06777"}
            onPress={() => router.push(`/pools/${pool.id}/`)}
          />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingTop: 2,
    paddingBottom: 4,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: 'center'
  },
  withBottomBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#3A454D",
  },
  txt: {
    color: "#F8F8F8",
  },
  usernameContainer: {
    marginTop: -4,
  },
  detailsTxt: {
    color: "#B8C3CC",
    fontSize: 12,
    fontFamily: "Saira_400Regular_Italic",
    marginTop: -4,
  },
  removeButtonContainer: {
    paddingLeft: 12,
  },
  btn: {
    backgroundColor: '',
    borderWidth: 1,
    borderColor: '#E06777',
    paddingHorizontal: 4,
  }
});
