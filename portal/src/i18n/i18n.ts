import i18next, { Resource } from "i18next";
import ICU from "i18next-icu";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import { Locale } from "./locale";
import enTranslation from "./en/translation.json";
import enZod from "./en/zod.json";
import enCustom from "./en/custom.json";
import zhHantTranslation from "./zh-Hant/translation.json";
import zhHantZod from "./zh-Hant/zod.json";
import zhHantCustom from "./zh-Hant/custom.json";
import zhHansTranslation from "./zh-Hans/translation.json";
import zhHansZod from "./zh-Hans/zod.json";
import zhHansCustom from "./zh-Hans/custom.json";

const resources: Resource = {
  [Locale.en]: {
    translation: enTranslation,
    zod: enZod,
    custom: enCustom,
  },
  [Locale.zhHant]: {
    translation: zhHantTranslation,
    zod: zhHantZod,
    custom: zhHantCustom,
  },
  [Locale.zhHans]: {
    translation: zhHansTranslation,
    zod: zhHansZod,
    custom: zhHansCustom,
  },
};

i18next
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: [Locale.zhHant, Locale.zhHans, Locale.en],
    ns: ["translation", "zod", "custom"],
    supportedLngs: [Locale.zhHant, Locale.zhHans, Locale.en],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["navigator"],
    },
  })
  .catch(console.error);
z.setErrorMap(makeZodI18nMap({ ns: ["zod", "custom"] }));

export default i18next;
