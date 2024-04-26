import React, { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import i18next from "../i18n/i18n";

const AppLocaleProvider: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
};

export default AppLocaleProvider;
