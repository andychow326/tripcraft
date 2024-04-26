import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ScreenLayout from "../components/ScreenLayout";
import HomeScreen from "../screens/HomeScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ScreenLayout>
        <HomeScreen />
      </ScreenLayout>
    ),
  },
]);

const AppRouterProvider: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouterProvider;
