import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ScreenLayout from "../components/ScreenLayout";
import HomeScreen from "../screens/HomeScreen";
import AppRoutes from "../AppRoutes";
import ProtectedScreenLayout from "../components/ProtectedScreenLayout";
import PlanCreateScreen from "../screens/PlanCreateScreen";
import PlanScreen from "../screens/PlanScreen";

const router = createBrowserRouter([
  {
    path: AppRoutes.HomeScreen.path,
    element: (
      <ScreenLayout>
        <HomeScreen />
      </ScreenLayout>
    ),
  },
  {
    path: AppRoutes.PlanCreateScreen.path,
    element: (
      <ProtectedScreenLayout>
        <PlanCreateScreen />
      </ProtectedScreenLayout>
    ),
  },
  {
    path: AppRoutes.PlanScreen.path,
    element: (
      <ScreenLayout>
        <PlanScreen />
      </ScreenLayout>
    ),
  },
]);

const AppRouterProvider: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouterProvider;
