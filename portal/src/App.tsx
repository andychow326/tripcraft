import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import AppRouterProvider from "./providers/AppRouterProvider";
import AppLocaleProvider from "./providers/AppLocaleProvider";

const App: React.FC = () => {
  return (
    <NextUIProvider>
      <AppLocaleProvider>
        <AppRouterProvider />
      </AppLocaleProvider>
    </NextUIProvider>
  );
};

export default App;
