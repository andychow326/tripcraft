import { useDisclosure } from "@nextui-org/react";
import React, { PropsWithChildren, createContext, useMemo } from "react";
import LoginModal from "../components/LoginModal";

interface AppModalContextValue {
  isOpenLoginModal: boolean;
  onOpenLoginModal: () => void;
  onCloseLoginModal: () => void;
  onOpenChangeLoginModal: () => void;
}

export const AppModalContext = createContext<AppModalContextValue>({
  isOpenLoginModal: false,
  onOpenLoginModal: () => {},
  onCloseLoginModal: () => {},
  onOpenChangeLoginModal: () => {},
});

const AppModalProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const {
    isOpen: isOpenLoginModal,
    onOpen: onOpenLoginModal,
    onClose: onCloseLoginModal,
    onOpenChange: onOpenChangeLoginModal,
  } = useDisclosure();

  const contextValue = useMemo<AppModalContextValue>(
    () => ({
      isOpenLoginModal: isOpenLoginModal,
      onOpenLoginModal: onOpenLoginModal,
      onCloseLoginModal: onCloseLoginModal,
      onOpenChangeLoginModal: onOpenChangeLoginModal,
    }),
    [
      isOpenLoginModal,
      onOpenLoginModal,
      onCloseLoginModal,
      onOpenChangeLoginModal,
    ],
  );

  return (
    <AppModalContext.Provider value={contextValue}>
      <LoginModal
        isOpen={isOpenLoginModal}
        onClose={onCloseLoginModal}
        onOpenChange={onOpenChangeLoginModal}
      />
      {children}
    </AppModalContext.Provider>
  );
};

export default AppModalProvider;
