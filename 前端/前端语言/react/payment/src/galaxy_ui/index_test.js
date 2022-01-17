/**
 * 测试环境(除DOMAIN=checkout.starservices.store以外的)
 */
import '@/utils/protoExtends'
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { getUrlParams, atapterLang,loadscript,has_name_fun } from '@/utils/index'
import '../index.css';
import i18n, { importAsyncLanguage } from '../i18n'
import App from './App';
import * as serviceWorker from '../serviceWorker';
// let isDev = process.env.NODE_ENV === 'development';
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
try {
    loadscript({ url: 'https://cdn.bootcdn.net/ajax/libs/vConsole/3.9.0/vconsole.min.js', id: 'VConsole' }, () => {
        var vConsole = new VConsole();
    })
} catch (error) {
    console.log('galaxy_ui_index.js',error)
}
Sentry.init({
    //http://e23ad87cc03a4584b560673221b16b42@localhost:8080/3 //我的本地服务
    dsn: "https://b2a03a3818b84a08a99ceaf96c93430e@o921403.ingest.sentry.io/5867774",//sentry官方服务器
    // dsn: isDev ? "https://b2a03a3818b84a08a99ceaf96c93430e@o921403.ingest.sentry.io/5867774" : "http://564558c5e9f649f5834522a2e2c16bd6@35.165.158.235:9005/2",
    integrations: [new Integrations.BrowserTracing()],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1,
});

const urlParmas = getUrlParams(window.location.href) // 获取地址参数对象
const lang = atapterLang(urlParmas.language ? urlParmas.language : '') // 语言字符串适配器
// 按需加载语言包
importAsyncLanguage(lang).then((data) => {
    i18n.addResourceBundle(lang, 'translation', data.default.translation, true, true);
    i18n.changeLanguage(lang);
}).finally(e=>{
    ReactDOM.render(<App />, document.getElementById('root'));
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
