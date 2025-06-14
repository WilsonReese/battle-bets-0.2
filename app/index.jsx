import { useContext, useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "../components/contexts/AuthContext";

const Index = () => {
  const { token, isConfirmed } = useContext(AuthContext);
  const [statusChecked, setStatusChecked] = useState(false);

  useEffect(() => {
    // Wait until context is hydrated
    if (token !== null && isConfirmed !== null) {
      setStatusChecked(true);
    } else if (!token) {
      setStatusChecked(true);
    }
  }, [token, isConfirmed]);

  if (!statusChecked) return null;

  if (!token) {
    return <Redirect href="/login" />;
  }

  if (!isConfirmed) {
    return <Redirect href="/emailConfirmation" />;
  }

  return <Redirect href="/pools/" />;
};

export default Index;