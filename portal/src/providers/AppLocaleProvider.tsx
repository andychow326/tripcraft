import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "../i18n/i18n";
import { Locale } from "../i18n/locale";

interface AppLocaleContextValue {
  locale: Locale;
  changeLocale: (value: Locale) => void;
}

export const AppLocaleContext = createContext<AppLocaleContextValue>({
  locale: Locale.en,
  changeLocale: () => {},
});

const AppLocaleProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [locale, setLocale] = useState<Locale>(
    (window.localStorage.getItem("locale") ?? Locale.en) as Locale,
  );

  const changeLocale = useCallback((value: Locale) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const newLocale = Locale[value];
    i18next
      .changeLanguage(newLocale, () => {
        setLocale(value);
        window.localStorage.setItem("locale", value);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    changeLocale(locale);
  }, [locale, changeLocale]);

  const contextValue = useMemo(
    () => ({
      locale: locale,
      changeLocale: changeLocale,
    }),
    [locale, changeLocale],
  );

  return (
    <AppLocaleContext.Provider value={contextValue}>
      <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
    </AppLocaleContext.Provider>
  );
};

export default AppLocaleProvider;
