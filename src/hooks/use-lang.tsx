import React, { createContext, useContext } from "react";
import { translations, Lang, TranslationKey } from "@/lib/i18n";

const LangContext = createContext<Lang>("en");

export const LangProvider: React.FC<{ lang: Lang; children: React.ReactNode }> = ({ lang, children }) => (
  <LangContext.Provider value={lang}>{children}</LangContext.Provider>
);

export const useLang = () => useContext(LangContext);

export const useT = () => {
  const lang = useLang();
  return (key: TranslationKey) => translations[lang][key];
};
