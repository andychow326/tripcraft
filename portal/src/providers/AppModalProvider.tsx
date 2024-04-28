import { useDisclosure } from "@nextui-org/react";
import React, { PropsWithChildren, createContext, useMemo } from "react";
import LoginModal from "../components/LoginModal";

interface AppModalContextValue {
  isOpenLoginModal: boolean;
  onOpenLoginModal: () => void;
  onOpenChangeLoginModal: () => void;
}

export const AppModalContext = createContext<AppModalContextValue>({
  isOpenLoginModal: false,
  onOpenLoginModal: () => {},
  onOpenChangeLoginModal: () => {},
});

const AppModalProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const {
    isOpen: isOpenLoginModal,
    onOpen: onOpenLoginModal,
    onOpenChange: onOpenChangeLoginModal,
  } = useDisclosure();

  const contextValue = useMemo<AppModalContextValue>(
    () => ({
      isOpenLoginModal: isOpenLoginModal,
      onOpenLoginModal: onOpenLoginModal,
      onOpenChangeLoginModal: onOpenChangeLoginModal,
    }),
    [isOpenLoginModal, onOpenLoginModal, onOpenChangeLoginModal],
  );

  return (
    <AppModalContext.Provider value={contextValue}>
      <LoginModal
        isOpen={isOpenLoginModal}
        onOpenChange={onOpenChangeLoginModal}
      />
      {children}
    </AppModalContext.Provider>
  );
};

export default AppModalProvider;
