import React from "react";
import { NextUIProvider } from "@nextui-org/react";

const App: React.FC = () => {
  return (
    <NextUIProvider>
      <div className="h-10">Hello Wrold</div>
    </NextUIProvider>
  );
};

export default App;
