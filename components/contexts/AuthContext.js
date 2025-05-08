import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

// Create a context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const decodeToken = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);
      return decoded.sub || decoded.user_id || null;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  };

  // On component mount, check if there's a token stored
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync("jwt_token");
      // console.log("Loaded token from SecureStore:", storedToken);
      if (storedToken) {
        setToken(storedToken);
        setCurrentUserId(decodeToken(storedToken));
      }
    };

    loadToken();
  }, []);

  const login = async (newToken) => {
    await SecureStore.setItemAsync("jwt_token", newToken);
    setToken(newToken);
    setCurrentUserId(decodeToken(newToken));
    // Check if there are any keys in AsyncStorage before clearing
    const keys = await AsyncStorage.getAllKeys();

    if (keys.length > 0) {
      await AsyncStorage.clear(); // Only clear if there are stored items
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("jwt_token");
    setToken(null);
    setCurrentUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, currentUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
