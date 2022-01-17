import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import EnUsTranslate from './locales/en-US'
// import DETranslate from './locales/de'
// import ESTranslate from './locales/es'
// import FRTranslate from './locales/fr'
// import JPTranslate from './locales/ja'
// import ar from './locales/ar'
// import pt from './locales/pt-BR'

const langs=['ar','de','en-US','es','fr','ja','pt-BR'];

let lang = (document.documentElement.lang ||'en').toLocaleLowerCase();
lang = (lang === 'en' || lang === 'en-us')? 'en-US' : lang
lang= (lang=== "de-de" ? 'de' : lang);
lang = (lang === 'pt' || lang === 'pt-pt') ? 'pt-BR' : lang

export const importAsyncLanguage = (lng) => {

  // 如果不存在语言包，直接返回
  if (!langs.includes(lng)) {
    return Promise.reject()
  }

  // 如果是英语，直接返回不用加载语言包
  if (lng === 'en' || lng === 'en-us') {
    return Promise.reject()
  }
  
  // 加载语言包
	return import(/* webpackChunkName: "[request]" */`@/locales/${lng}`)
}
i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    resources: {
      en: EnUsTranslate
    },
    // resources: {
    //   en: EnUsTranslate,
    //   de: DETranslate,
    //   es: ESTranslate,
    //   fr: FRTranslate,
    //   ja: JPTranslate,
    //   jp: JPTranslate,
    //   ar,
    //   pt,
    // },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'production' ? false : true,
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    }
  });

  
export default i18n