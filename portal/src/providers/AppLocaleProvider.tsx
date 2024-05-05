import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { I18nextProvider } from "react-i18next";
import { I18nProvider } from "@react-aria/i18n";
import i18next from "../i18n/i18n";
import { Locale } from "../i18n/locale";
import { Translations } from "../../generated";

interface AppLocaleContextValue {
  locale: Locale;
  translate: (translations?: Translations | null) => string;
  changeLocale: (value: Locale) => void;
}

export const AppLocaleContext = createContext<AppLocaleContextValue>({
  locale: Locale.en,
  translate: () => "",
  changeLocale: () => {},
});

const AppLocaleProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [locale, setLocale] = useState<Locale>(
    (window.localStorage.getItem("locale") ?? Locale.en) as Locale,
  );

  const translate = useCallback(
    (translations?: Translations | null): string => {
      if (translations == null) {
        return "";
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const result = translations[locale] ?? translations.en;
      return result;
    },
    [locale],
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
      translate: translate,
      changeLocale: changeLocale,
    }),
    [locale, translate, changeLocale],
  );

  return (
    <AppLocaleContext.Provider value={contextValue}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-expect-error */}
      <I18nProvider locale={Locale[locale]}>
        <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
      </I18nProvider>
    </AppLocaleContext.Provider>
  );
};

export default AppLocaleProvider;
