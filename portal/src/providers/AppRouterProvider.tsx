import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomeScreen from "../screens/HomeScreen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
  },
]);

const AppRouterProvider: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouterProvider;
