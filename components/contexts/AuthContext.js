import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

// Create a context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // On component mount, check if there's a token stored
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync('jwt_token');
      if (storedToken) {
        setToken(storedToken);
      }
    };

    loadToken();
  }, []);

  const login = async (newToken) => {
    await SecureStore.setItemAsync('jwt_token', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('jwt_token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};