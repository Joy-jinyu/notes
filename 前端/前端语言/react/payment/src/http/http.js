import axios from 'axios'
import qs from 'qs'
import i18n from '../i18n'
import { trigger,InitMessage } from "@/utils";

const duration = 10000;
axios.defaults.withCredentials = false;
axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
};

let httpCount = 0

const DOMAIN = process.env.DOMAIN || '';
const baseURL = `https://${DOMAIN}/`
const { shop = {} } = window.shopify_checkouts || {};
const { identity_code = '', csrf_token = '', platform_name } = shop;

const instance = axios.create({
    baseURL: baseURL,
    timeout: duration,
    headers: {
        identity_code,
        csrf_token,
        platform: platform_name
    },
    transformRequest: [function (data, headers) {
        if (headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8') {
            if (data) {
                data = qs.stringify(data)
                // let ret = ''
                // let d = data
                // for (let it in d) {
                //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(d[it]) + '&'
                // }
                // ret = ret.substring(0, ret.lastIndexOf('&'));
                // return ret
                return data
            }
        }

        if (headers['Content-Type'] === 'application/json' && (data instanceof Object)) {
            return data && JSON.stringify(data)
        }
        return data
    }],

})

// 请求拦截器
instance.interceptors.request.use(
    config => {
        httpCount += 1
        console.log('loading show')
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// response 拦截器
instance.interceptors.response.use(
    response => {
        httpCount -= 1
        httpCount = (httpCount < 0 ? 0 : httpCount)
        if (httpCount === 0) {
            console.log('hide loading .....')
        }
        return response.data
    },
    error => {
        let { data, config = {}, status = 0 } = error.response || {};
        let obj = { display_type: 0, message_key: '', message: 'server error', status }; // display_type默认是0 表示界面上显示错误信息，1，弹窗显示
        // 处理提示语言内容
        if (error.response) {
            // 如果响应体data数据是json
            if (typeof data === 'object') {
                obj = Object.assign(obj, data);
            } else { // 如果data是string内容，就赋值给message
                obj.message = data || 'server error';
            }
            let cardError = i18n.store?.data[i18n.language]?.translation?.cardError || {};
            let suitedkey = false;//翻译中是否有匹配的Key
            if (obj.message_key) {//匹配时使用全小写，且若最后一位是 .或。则删除后再匹配
                let new_message_key = InitMessage(obj.message_key);
                if (cardError[new_message_key]) {//优先用key匹配
                    obj.message = i18n.t('cardError.' + new_message_key);
                    suitedkey = true;
                }
            };
            if (!suitedkey&&obj.message) {
                let new_message = InitMessage(obj.message);
                if (cardError[new_message]) {
                    obj.message = i18n.t('cardError.' + new_message);
                }
            }
            // 如果需要弹出提示isalert, 则提示对应多语言
            if (config.isalert) {
                alert(obj.message)
            }
        }
        let { payment_gate_way = '', payment_method = '' } = qs.parse(config?.data) || {}
        trigger('CheckoutApiError', { channel: payment_gate_way, gateWay: payment_method, url: config.url, message: obj.message || '' });

        // 目前除了post其他返回的参数都是string
        if (config && config.method === 'post') {
            return Promise.reject(obj)
        } else {
            return Promise.reject(obj.message)
        }
    }
)

export default instance