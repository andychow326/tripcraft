import { useDisclosure } from "@nextui-org/react";
import React, { PropsWithChildren, createContext, useMemo } from "react";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

interface AppModalContextValue {
  isOpenLoginModal: boolean;
  onOpenLoginModal: () => void;
  onCloseLoginModal: () => void;
  onOpenChangeLoginModal: () => void;
  isOpenSignupModal: boolean;
  onCloseSignupModal: () => void;
  onOpenSignupModal: () => void;
  onOpenChangeSignupModal: () => void;
}

export const AppModalContext = createContext<AppModalContextValue>({
  isOpenLoginModal: false,
  onOpenLoginModal: () => {},
  onCloseLoginModal: () => {},
  onOpenChangeLoginModal: () => {},
  isOpenSignupModal: false,
  onCloseSignupModal: () => {},
  onOpenSignupModal: () => {},
  onOpenChangeSignupModal: () => {},
});

const AppModalProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const {
    isOpen: isOpenLoginModal,
    onOpen: onOpenLoginModal,
    onClose: onCloseLoginModal,
    onOpenChange: onOpenChangeLoginModal,
  } = useDisclosure();
  const {
    isOpen: isOpenSignupModal,
    onOpen: onOpenSignupModal,
    onClose: onCloseSignupModal,
    onOpenChange: onOpenChangeSignupModal,
  } = useDisclosure();

  const contextValue = useMemo<AppModalContextValue>(
    () => ({
      isOpenLoginModal: isOpenLoginModal,
      onOpenLoginModal: onOpenLoginModal,
      onCloseLoginModal: onCloseLoginModal,
      onOpenChangeLoginModal: onOpenChangeLoginModal,
      isOpenSignupModal: isOpenSignupModal,
      onOpenSignupModal: onOpenSignupModal,
      onCloseSignupModal: onCloseSignupModal,
      onOpenChangeSignupModal: onOpenChangeSignupModal,
    }),
    [
      isOpenLoginModal,
      onOpenLoginModal,
      onCloseLoginModal,
      onOpenChangeLoginModal,
      isOpenSignupModal,
      onCloseSignupModal,
      onOpenSignupModal,
      onOpenChangeSignupModal,
    ],
  );

  return (
    <AppModalContext.Provider value={contextValue}>
      <LoginModal
        isOpen={isOpenLoginModal}
        onClose={onCloseLoginModal}
        onOpenChange={onOpenChangeLoginModal}
      />
      <SignupModal
        isOpen={isOpenSignupModal}
        onClose={onCloseSignupModal}
        onOpenChange={onOpenChangeSignupModal}
      />
      {children}
    </AppModalContext.Provider>
  );
};

export default AppModalProvider;
