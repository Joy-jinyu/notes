/**
 * 正式环境(只允许DOMAIN=checkout.starservices.store走这里)
 */
// import "@babel/polyfill"
import '@/utils/protoExtends'
import React from 'react';
import ReactDOM from 'react-dom';
import { getUrlParams, atapterLang,loadscript,has_name_fun } from '@/utils/index'
import i18n, { importAsyncLanguage } from '../i18n'
import '../index.css';
import App from './App';
import * as serviceWorker from '../serviceWorker';
let { order = {} } = window.shopify_checkouts || {};
let { groupGateway=[] } = order;
/**
 * 这里判断是否需要预加载加载stripe
 * 需要满足不是app(app的话是桥接的，不需要用stripe)，且支付渠道里有正确的applepay和对应publicKey
 */
if (!has_name_fun('is_app')) {
    let applepay=groupGateway&&groupGateway.find(item=>item.payGateWay==="apple_pay");
    if(applepay&&applepay.publicKey){
        loadscript({ url: 'https://js.stripe.com/v3/', isPreload: true });
    }
}

const urlParmas = getUrlParams(window.location.href) // 获取地址参数对象
const lang = atapterLang(urlParmas.language ? urlParmas.language : '') // 语言字符串适配器
// 按需加载语言包
importAsyncLanguage(lang).then((data) => {
    i18n.addResourceBundle(lang, 'translation', data.default.translation, true, true);
    i18n.changeLanguage(lang);
}).finally(e => {
    ReactDOM.render(<App />, document.getElementById('root'));
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
