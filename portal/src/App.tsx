import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import AppRouterProvider from "./providers/AppRouterProvider";

const App: React.FC = () => {
  return (
    <NextUIProvider>
      <AppRouterProvider />
    </NextUIProvider>
  );
};

export default App;
