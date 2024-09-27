import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("jwt_token");
      setLoggedIn(!!token);
    };

    checkLogin();
  }, []);

  if (loggedIn === null) {
    // You can add a loading spinner here while the login check is in progress
    return null;
  }

  return <Redirect href={loggedIn ? "/pools/" : "/login"} />;
};

export default Index;
