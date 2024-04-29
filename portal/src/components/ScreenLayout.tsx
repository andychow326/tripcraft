import React, { PropsWithChildren, useContext } from "react";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { AppModalContext } from "../providers/AppModalProvider";

const ScreenLayout: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const { t } = useTranslation();
  const { onOpenLoginModal, onOpenSignupModal } = useContext(AppModalContext);

  return (
    <div className="flex flex-col w-full h-full">
      <Navbar>
        <NavbarBrand>
          <p className="font-bold text-inherit">
            {t("ScreenLayout.navbar.logo.name")}
          </p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Button
              as={Link}
              color="secondary"
              variant="light"
              onPress={onOpenSignupModal}
            >
              {t("ScreenLayout.navbar.button.signup.label")}
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              color="primary"
              href="#"
              variant="flat"
              onPress={onOpenLoginModal}
            >
              {t("ScreenLayout.navbar.button.login.label")}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default ScreenLayout;
