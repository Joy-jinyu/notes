// import "@babel/polyfill"
import '@/utils/protoExtends'
import React from 'react';
import ReactDOM from 'react-dom';
import { getUrlParams, atapterLang } from '@/utils/index'
import i18n, { importAsyncLanguage } from '../i18n'
import '../index.css';
import App from './App';
import * as serviceWorker from '../serviceWorker';
const urlParmas = getUrlParams(window.location.href) // 获取地址参数对象
const lang = atapterLang(urlParmas.language ? urlParmas.language : '') // 语言字符串适配器

// 按需加载语言包
importAsyncLanguage(lang).then((data) => {
    i18n.addResourceBundle(lang, 'translation', data.default.translation, true, true);
    i18n.changeLanguage(lang);
}).finally(err => {
    ReactDOM.render(<App />, document.getElementById('root'));
})


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();