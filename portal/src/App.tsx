import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import AppRouterProvider from "./providers/AppRouterProvider";
import AppLocaleProvider from "./providers/AppLocaleProvider";
import AppModalProvider from "./providers/AppModalProvider";

const App: React.FC = () => {
  return (
    <NextUIProvider>
      <AppLocaleProvider>
        <AppModalProvider>
          <AppRouterProvider />
        </AppModalProvider>
      </AppLocaleProvider>
    </NextUIProvider>
  );
};

export default App;
