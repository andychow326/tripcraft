import i18next, { Resource } from "i18next";
import ICU from "i18next-icu";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { Locale } from "./locale";
import enTranslation from "./en/translation.json";

const resources: Resource = {
  [Locale.en]: {
    translation: enTranslation,
  },
};

i18next
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: [Locale.en],
    ns: ["translation"],
    supportedLngs: [Locale.en],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["navigator"],
    },
  })
  .catch(console.error);

export default i18next;
