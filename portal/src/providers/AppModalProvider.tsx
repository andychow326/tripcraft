import { useDisclosure } from "@nextui-org/react";
import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

interface OpenModalOptions {
  isDismissable: boolean;
  hideCloseButton: boolean;
}

interface AppModalContextValue {
  isOpenLoginModal: boolean;
  onOpenLoginModal: (options?: OpenModalOptions) => void;
  onCloseLoginModal: () => void;
  onOpenChangeLoginModal: () => void;
  isOpenSignupModal: boolean;
  onCloseSignupModal: () => void;
  onOpenSignupModal: (options?: OpenModalOptions) => void;
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
  const [openLoginModalOptions, setOpenLoginModalOptions] = useState<
    OpenModalOptions | undefined
  >();
  const [openSignupModalOptions, setOpenSignupModalOptions] = useState<
    OpenModalOptions | undefined
  >();
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

  const _onOpenLoginModal = useCallback(
    (options?: OpenModalOptions) => {
      setOpenLoginModalOptions(options);
      onOpenLoginModal();
    },
    [onOpenLoginModal],
  );

  const _onOpenSignupModal = useCallback(
    (options?: OpenModalOptions) => {
      setOpenSignupModalOptions(options);
      onOpenSignupModal();
    },
    [onOpenSignupModal],
  );

  const contextValue = useMemo<AppModalContextValue>(
    () => ({
      isOpenLoginModal: isOpenLoginModal,
      onOpenLoginModal: _onOpenLoginModal,
      onCloseLoginModal: onCloseLoginModal,
      onOpenChangeLoginModal: onOpenChangeLoginModal,
      isOpenSignupModal: isOpenSignupModal,
      onOpenSignupModal: _onOpenSignupModal,
      onCloseSignupModal: onCloseSignupModal,
      onOpenChangeSignupModal: onOpenChangeSignupModal,
    }),
    [
      isOpenLoginModal,
      _onOpenLoginModal,
      onCloseLoginModal,
      onOpenChangeLoginModal,
      isOpenSignupModal,
      onCloseSignupModal,
      _onOpenSignupModal,
      onOpenChangeSignupModal,
    ],
  );

  return (
    <AppModalContext.Provider value={contextValue}>
      <LoginModal
        isDismissable={openLoginModalOptions?.isDismissable}
        hideCloseButton={openLoginModalOptions?.hideCloseButton}
        isOpen={isOpenLoginModal}
        onClose={onCloseLoginModal}
        onOpenChange={onOpenChangeLoginModal}
      />
      <SignupModal
        isDismissable={openSignupModalOptions?.isDismissable}
        hideCloseButton={openSignupModalOptions?.hideCloseButton}
        isOpen={isOpenSignupModal}
        onClose={onCloseSignupModal}
        onOpenChange={onOpenChangeSignupModal}
      />
      {children}
    </AppModalContext.Provider>
  );
};

export default AppModalProvider;
