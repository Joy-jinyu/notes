/*
 * @Author: yangj
 * @Date: 2020-02-29 10:26:13
 */
// const baseURL = (window.location.hostname === "localhost"||window.location.hostname === "test-checkouts.myshopify.com") ?'https://7d5c1bfefc46.ngrok.io/': '';

import i18n from '../i18n'
import { trigger } from "../utils";
const DOMAIN = process.env.DOMAIN || '';
const baseURL = `https://${DOMAIN}/`
const { shop = {} } = window.shopify_checkouts || {};
const { identity_code = '', csrf_token = '', platform_name } = shop;
function initLang(code) {
  let newCode = (code && code.trim()) || '';
  if (newCode) {
    let { language, options } = i18n || {};
    const { resources = {} } = options || {};
    let lang = (language === 'en-US' ? 'en' : language);
    lang = (lang === 'pt-BR' ? 'pt' : lang);
    let datas = resources[lang] || resources['en'];
    return datas.translation && datas.translation.cardError && datas.translation.cardError[newCode]
  }
}
function initUrl(url) {
  return (url.includes('https://') || url.includes('http://')) ? url : `${baseURL}${url}`
}
function post(url, data = {}, other) {
  const { isalert = false, headers = {} } = other || {};
  return new Promise((resolve, reject) => {
    $.ajax({
      // beforeSend: function (XMLHttpRequest) {
      //   XMLHttpRequest.setRequestHeader("identity_code", identity_code);
      //   XMLHttpRequest.setRequestHeader("csrf_token", csrf_token);
      // },
      headers: { identity_code, csrf_token, platform: platform_name, ...headers },
      type: 'post',
      url: initUrl(url),
      dataType: 'json',
      crossDomain: true,
      data,
      success: (dt) => {
        resolve(dt)
      },
      error: (err) => {
        let { readyState, statusText, responseJSON, responseText, status } = err || {};
        let obj = { display_type: 0 };//默认是0 表示界面上显示错误信息，1，弹窗显示
        if (responseJSON && typeof (responseJSON) === 'object') {//返回结构为含有错误代码的对象时候
          responseJSON.message = (initLang(responseJSON.message_key) || initLang(responseJSON.message || responseText) || responseJSON.message || responseText || 'server error');
          obj = responseJSON || {};
        } else {
          obj.message_key = 200;
          obj.message = initLang(responseText) || responseText || 'server error';
        }
        obj.status = status;
        // obj.message_key='BP-DR-98'//BP-DR-98
        trigger('CheckoutApiError',{url,message:obj.message||''});
        reject(obj);
        if (readyState === 0 && statusText === 'error') {
          //ipad错误
        } else {
          if (isalert) {
            alert(obj.message);
          }
        }
      }
    })
  })
}
function get(url, data = {}, other) {
  const { isalert = false } = other || {};
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'get',
      url: initUrl(url),
      dataType: 'json',
      crossDomain: true,
      data,
      success: (dt) => {
        resolve(dt)
      },
      error: (err) => {
        reject(err);
        let { readyState, statusText, responseJSON, responseText } = err || {};
        let errorMessage = responseText || 'server error';
        if (responseJSON && typeof (responseJSON) === 'object') {//返回结构为含有错误代码的对象时候
          errorMessage = initLang(responseJSON.message_key) || initLang(responseJSON.message) || responseJSON.message || 'server error';
        } else {
          errorMessage = initLang(errorMessage) || errorMessage;
        }
        if (readyState === 0 && statusText === 'error') {
          //ipad错误
        } else {
          // isalert && alert((err && err.responseText) || `server error,${baseURL}${url},${JSON.stringify(data)},${JSON.stringify(err)}`);
          isalert && alert(errorMessage);
        }
        trigger('CheckoutApiError',{url,message:errorMessage||''});
      }
    })
  })
}
function put(url, data = {}, other) {
  const { isalert = false } = other || {};
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'put',
      url: initUrl(url),
      dataType: 'json',
      crossDomain: true,
      headers: { identity_code, csrf_token },
      data,
      success: (dt) => {
        resolve(dt)
      },
      error: (err) => {
        reject(err)
        let { readyState, statusText } = err || {};
        if (readyState === 0 && statusText === 'error') {
          //ipad错误
        } else {
          isalert && alert((err && err.responseText) || 'server error');
        }
      }
    })
  })
}
export { post, get, put }
