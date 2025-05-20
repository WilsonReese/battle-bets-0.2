import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Button, TextInput } from "react-native";
import { useRouter } from "expo-router";
import api from "../../../utils/axiosConfig"; // 👈 your existing API instance
import { AuthContext } from "../../../components/contexts/AuthContext";
import { useToastMessage } from "../../../hooks/useToastMessage";
import { Txt } from "../../../components/general/Txt";
import { Btn } from "../../../components/general/Buttons/Btn";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ProfileDetailsRow } from "../../../components/Profile/profileDetailsRow";

export default function Profile() {
  const { logout, token } = useContext(AuthContext);
  const router = useRouter();
  const { showError, showSuccess } = useToastMessage();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
  });
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await api.get("/current_user"); // 👈 simple GET request
        setUser(res.data);
        setForm({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          username: res.data.username,
        });
      } catch (err) {
        console.error("Error fetching user:", err.message);
        showError("Failed to load user profile.");
      }
    };

    fetchCurrentUser();
  }, []);

  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_]{2,19}$/;
    const errs = {};
    if (!usernameRegex.test(form.username)) {
      errs.username =
        "must be 3–20 characters, use letters/numbers/underscores only, and start with a letter or underscore.";
    }
    return errs;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await api.patch("/users/update_profile", form);
      setUser(res.data);
      showSuccess("Profile updated.");
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      showError("Failed to update profile.");
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await api.delete("/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        await logout();
        showSuccess("Logged out successfully.");
        router.replace("/login");
      } else {
        showError("Logout failed. Try again.");
      }
    } catch (err) {
      console.error("Logout error:", err.message);
      showError("An error occurred.");
    }
  };

  return (
    <View style={s.container}>
      <View style={s.titleContainer}>
        <Txt style={s.titleTxt}>Profile</Txt>
        <Btn
          btnText={isEditing ? "Save" : "Edit"}
          isEnabled={true}
          fontSize={14}
          style={s.btn}
          onPress={handleEditToggle}
        />
      </View>
      {user ? (
        <>
          <ProfileDetailsRow
            label={"Name:"}
            editable={isEditing}
            value={`${form.first_name} ${form.last_name}`}
            inputs={
              <View style={s.nameInputs}>
                <TextInput
                  style={s.input}
                  value={form.first_name}
                  placeholder="First Name"
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, first_name: text }))
                  }
                />
                <TextInput
                  style={s.input}
                  value={form.last_name}
                  placeholder="Last Name"
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, last_name: text }))
                  }
                />
              </View>
            }
          />
          <ProfileDetailsRow
            label={"Username:"}
            editable={isEditing}
            value={form.username}
            inputs={
              <TextInput
                style={s.input}
                value={form.username}
                placeholder="Username"
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, username: text }))
                }
              />
            }
            error={errors.username}
          />
          <ProfileDetailsRow label={"Email:"} info={user.email} />
          <ProfileDetailsRow label={"Member Since:"} info={user.created_at} />
        </>
      ) : (
        <Txt style={s.txt}>Loading user info...</Txt>
      )}

      <View style={{ marginTop: 24 }}>
        <Txt style={s.txt}>Options:</Txt>
        <Txt style={s.txt}>• Change password</Txt>
        <Txt style={s.txt}>• Notification Settings</Txt>
        <Txt style={s.txt}>• Terms and Conditions</Txt>
        <Txt style={s.txt}>• Delete account</Txt>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#061826",
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "green",
  },
  titleTxt: {
    color: "#F8F8F8",
    fontSize: 24,
    // marginBottom: 12,
  },
  btn: {
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoContatiner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  txt: {
    color: "#F8F8F8",
    paddingVertical: 4,
  },
  labelTxt: {
    fontFamily: "Saira_400Regular_Italic",
    fontSize: 14,
  },
  input: {
    fontFamily: "Saira_600SemiBold",
    height: 48,
    // backgroundColor: "#F8F8F8",
    borderColor: "#3A454D",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    // marginBottom: 12,
    color: "#F8F8F8",
    fontSize: 14,
    flex: 1,
  },
  nameInputs: {
    flexDirection: 'row',
    // backgroundColor: 'blue',
    gap: 4,
  }
});
