import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ScreenLayout from "../components/ScreenLayout";
import HomeScreen from "../screens/HomeScreen";
import AppRoutes from "../AppRoutes";

const router = createBrowserRouter([
  {
    path: AppRoutes.HomeScreen.path,
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
