
// import React from "react";

// // ←—— only in development, before any other imports
// if (__DEV__) {
//   const whyDidYouRender = require("@welldone-software/why-did-you-render");
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//     trackHooks:            true,
//   });
// }
// // ——————————————————————————————

import { useContext, useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "../components/contexts/AuthContext";

const Index = () => {
  const { token, isConfirmed, isAuthLoading } = useContext(AuthContext);

  if (isAuthLoading) return null; // ⏳ Wait until rehydration finishes

  if (!token) {
    return <Redirect href="/login" />;
  }

  if (!isConfirmed) {
    return <Redirect href="/emailConfirmation" />;
  }

  return <Redirect href="/pools/" />;
};

export default Index;