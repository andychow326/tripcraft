import React, { PropsWithChildren, useContext, useEffect } from "react";
import ScreenLayout from "./ScreenLayout";
import { AuthContext } from "../providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { AppModalContext } from "../providers/AppModalProvider";

const ProtectedScreenLayout: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const { isAuthenticated } = useContext(AuthContext);
  const { isOpenLoginModal, isOpenSignupModal, onOpenLoginModal } =
    useContext(AppModalContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }
    if (!isOpenLoginModal && !isOpenSignupModal) {
      onOpenLoginModal({ isDismissable: false, hideCloseButton: true });
    }
  }, [
    isAuthenticated,
    isOpenLoginModal,
    isOpenSignupModal,
    navigate,
    onOpenLoginModal,
  ]);

  return <ScreenLayout>{children}</ScreenLayout>;
};

export default ProtectedScreenLayout;
