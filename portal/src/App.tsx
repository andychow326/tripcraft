import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import AppRouterProvider from "./providers/AppRouterProvider";
import AppLocaleProvider from "./providers/AppLocaleProvider";
import AppModalProvider from "./providers/AppModalProvider";
import AppQueryClientProvider from "./providers/AppQueryClientProvider";
import ApiClientProvider from "./providers/ApiClientProvider";
import AuthProvider from "./providers/AuthProvider";

const App: React.FC = () => {
  return (
    <NextUIProvider>
      <AuthProvider>
        <AppQueryClientProvider>
          <ApiClientProvider>
            <AppLocaleProvider>
              <AppModalProvider>
                <AppRouterProvider />
              </AppModalProvider>
            </AppLocaleProvider>
          </ApiClientProvider>
        </AppQueryClientProvider>
      </AuthProvider>
    </NextUIProvider>
  );
};

export default App;
