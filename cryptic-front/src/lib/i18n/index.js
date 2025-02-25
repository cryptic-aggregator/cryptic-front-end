import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LOCALS } from "./constants.js";
import { uk } from "./copies/uk.js";
import { en } from "./copies/en.js";

const resources = {
  [LOCALS.EN]: {
    translation: en
  },
  [LOCALS.UK]: {
    translation: uk
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: LOCALS.EN, 
    interpolation: {
      escapeValue: false
    }
  });



export default i18n;
