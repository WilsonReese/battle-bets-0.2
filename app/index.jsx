import { useContext, useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "../components/contexts/AuthContext";

const Index = () => {
  const { token, isConfirmed, isAuthLoading } = useContext(AuthContext);

  if (isAuthLoading) return null; // ⏳ Wait until rehydration finishes

  if (!token) {
    return <Redirect href="/login" />;
  }

  if (isConfirmed === false) {
    return <Redirect href="/emailConfirmation" />;
  }

  return <Redirect href="/pools/" />;
};

export default Index;