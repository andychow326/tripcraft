import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Select,
  SelectItem,
  SelectSection,
  Selection,
} from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { AppModalContext } from "../providers/AppModalProvider";
import { AppLocaleContext } from "../providers/AppLocaleProvider";
import { Locale } from "../i18n/locale";
import { IconLogout, IconUserFilled, IconWorld } from "@tabler/icons-react";
import { AuthContext } from "../providers/AuthProvider";

interface LocaleSelectorProps {
  className?: string;
  locale: Locale;
  onSelectionChange: (key: Selection) => void;
  localeOptions: {
    label: string;
    value: string;
  }[];
}

const LocaleSelector: React.FC<LocaleSelectorProps> = (props) => {
  const { className, locale, onSelectionChange, localeOptions } = props;

  return (
    <Select
      aria-label="Locale"
      className={className}
      startContent={<IconWorld />}
      labelPlacement="outside-left"
      selectionMode="single"
      selectedKeys={[locale]}
      onSelectionChange={onSelectionChange}
    >
      {localeOptions.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
};

const ScreenLayout: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [isNavMenuOpen, setIsNavMenuOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { onOpenLoginModal, onOpenSignupModal } = useContext(AppModalContext);
  const { locale, changeLocale } = useContext(AppLocaleContext);
  const auth = useContext(AuthContext);

  const localeOptions = useMemo(
    () =>
      Object.keys(Locale).map((locale) => ({
        label: t(`ScreenLayout.navbar.locale.${locale}.label`),
        value: locale,
      })),
    [t],
  );

  const onSelectionChangeLocale = useCallback(
    (key: Selection) => {
      if (typeof key === "object") {
        const selections = Array.from(key.values());
        if (selections.length > 0) {
          changeLocale(selections[0] as Locale);
        }
      }
    },
    [changeLocale],
  );

  return (
    <div className="flex flex-col w-full h-full">
      <Navbar
        className="border-b-1 border-black"
        onMenuOpenChange={setIsNavMenuOpen}
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isNavMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <p className="font-bold text-inherit">
              {t("ScreenLayout.navbar.logo.name")}
            </p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem className="hidden sm:list-item">
            <LocaleSelector
              className="w-48"
              locale={locale}
              localeOptions={localeOptions}
              onSelectionChange={onSelectionChangeLocale}
            />
          </NavbarItem>
          {auth.isAuthenticated ? (
            <Select
              className="w-40 sm:w-60"
              aria-label="Account"
              labelPlacement="outside-left"
              selectionMode="single"
              selectedKeys={[auth.user.name]}
              disabledKeys={[auth.user.name]}
              startContent={<IconUserFilled />}
            >
              <SelectSection
                title={t("ScreenLayout.navbar.account.section.profile.title")}
              >
                <SelectItem
                  key={auth.user.name}
                  value={auth.user.name}
                  selectedIcon={<></>}
                >
                  {auth.user.name}
                </SelectItem>
              </SelectSection>
              <SelectItem
                key="logout"
                className=" text-red-600"
                startContent={<IconLogout className="w-4 h-4" />}
                onPress={auth.logout}
              >
                {t("ScreenLayout.navbar.account.section.action.logout")}
              </SelectItem>
            </Select>
          ) : (
            <>
              <NavbarItem>
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
            </>
          )}
        </NavbarContent>
        <NavbarMenu>
          <NavbarMenuItem>
            <LocaleSelector
              locale={locale}
              localeOptions={localeOptions}
              onSelectionChange={onSelectionChangeLocale}
            />
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default ScreenLayout;
