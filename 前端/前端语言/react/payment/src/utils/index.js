/*
 * @Author: yangj
 * @Date: 2020-03-03 16:00:58
 * @LastEditors: yangj
 */
import parser from 'ua-parser-js';
import { eventPayment } from '../jsBridge'
const { order = {}, shop = {} } = window.shopify_checkouts || {};
const { trans_id: transId, orderNumber, uuid, order_domain = '' } = order || {}
const { name, default_country: defaultCountry, identity_code: identityCode, platform_name } = shop || {}
let lang = document.documentElement.lang
const DOMAIN = process.env.DOMAIN || '';
const IS_PROD = DOMAIN.includes('checkout.starservices.store');
/*
*给number加解决浮点数的函数
*/
Number.prototype.precision = function (num, fix = 2) {// eslint-disable-line
    let newNum = 0;
    if (num) {
        // newNum = Math.round((num.toFixed(fix)) * 100) / 100;
        newNum = (Math.round(num * 100) / 100).toFixed(fix);
    }
    return newNum
}
let isScroll = true;
function funverify({ value, verify = [], item = {}, scroll = false }) {
    let isOk = true;
    if (verify) {
        verify.forEach(it => {//eslint-disable-line
            if (it.required) {
                if (value || value === 0) {//eslint-disable-line
                    isOk = true;
                    item.error = false;
                } else {
                    isOk = false;
                    item.error = true;
                    console.warn(`${item.name}--Field is empty,${value}`);
                }
            } else if (it.pattern) {
                if (value || value === 0) {
                    let reg = new RegExp(it.pattern);
                    if (reg.test(value)) {
                        isOk = true;
                        item.error = false;
                    } else {
                        isOk = false;
                        item.error = true;
                        console.warn(`${item.name}--Field is empty,${value}`);
                    }
                }

            } else {
                isOk = true;
                item.error = false;
            }
        })
    } else {
        isOk = true;
    }
    if (isScroll && !isOk && scroll && item.name) {
        scrollToId(item.name);
        trigger('CheckoutVerify', { name: item.name || '', value });
    }
    return isOk
}

/**
 * 地址参数解析为json对象
 * @param {url} ul 
 * @returns 
 */
export const getUrlParams = (ul) => {
    var url = ul || '' //获取url中"?"符后的字串
    var theRequest = {}
    var strs
    var fromIndex = url.indexOf('?')
    var index = url.indexOf('?', fromIndex + 1)
    if (index === -1) {
        index = fromIndex
    }
    if (index !== -1) {
        var str = url.substr(index + 1)
        strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
    }
    return theRequest
}

/**
 * 获取元素offsetTop
 * @param {dom} curEle 
 * @returns 
 */
function offset(curEle) {
    let totalLeft = null, totalTop = null, par = curEle.offsetParent;
    //首先加自己本身的左偏移和上偏移
    totalLeft += curEle.offsetLeft;
    totalTop += curEle.offsetTop
    //只要没有找到body，我们就把父级参照物的边框和偏移也进行累加
    while (par) {
        if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
            //累加父级参照物的边框
            totalLeft += par.clientLeft;
            totalTop += par.clientTop
        }

        //累加父级参照物本身的偏移
        totalLeft += par.offsetLeft;
        totalTop += par.offsetTop
        par = par.offsetParent;
    }

    return {
        left: totalLeft,
        top: totalTop
    }
}
const scrollToId = (scrollId) => {
    /* old */
    // let dom = $(`#${scrollId}`);

    /* new */
    let dom = querySelector(`#${scrollId}`);

    /* old */
    /* if (dom && dom.offset()) {
        let isMobile = document.body.clientWidth < 750;
        isScroll = false;
        let top = (dom.offset().top - dom.height());
        if (isMobile) {
            top = top - 50;
        }
        if (typeof (top) !== 'number') {
            top = 0;
        }
        top <= 0 && (top = 0);
        // window.scrollTo(0,top);
        $("html,body").animate({ scrollTop: top }, 200);
        setTimeout(function () {
            isScroll = true;
        }, 300);
    } */

    /* new */
    if (!dom) {
        return false
    }
    let top = offset(dom).top
    if (dom && top) {
        let isMobile = document.body.clientWidth < 750;
        isScroll = false;

        if (isMobile) {
            top = top - 100;
        }
        window.scrollTo({
            top,
            behavior: "smooth"
        });
        setTimeout(function () {
            isScroll = true;
        }, 300);
    }
}
const rule = {
    email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
    phone: /^(\+[1-9])?\s?[\d-()]{1,20}$/,
    emailAndPhone: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*|[0-9_]{5,}$/,//邮箱或者电话号码
}
const initBillingAddress = (t) => {
    // let isMIDDLE = (name === 'vivaiacollection_ar'||name === 'adorawe');//是中东
    return [
        // { name: t('paymentMethod.billingAddress.title'), type: 'title' },
        { name: 'billing_first_name', type: 'input', placeholder: t('shippingAddress.firstName'), dynamic: 50, verify: [{ required: true }], maxLength: 50 },
        { name: 'billing_last_name', type: 'input', placeholder: t('shippingAddress.lastName'), dynamic: 50, verify: [{ required: true }], maxLength: 50 },
        { name: 'billing_address1', type: 'input', placeholder: t('shippingAddress.address'), verify: [{ required: true }] },
        { name: 'billing_address2', type: 'input', placeholder: t('paymentMethod.billingAddress.apartment') },
        { name: 'billing_city', type: 'input', placeholder: t('shippingAddress.city'), verify: [{ required: true }] },
        {
            name: 'billing_country', type: 'select', placeholder: t('shippingAddress.countryRegion'), dynamic: 50, option: [], verify: [{ required: true }]
        },
        { name: 'billing_province', type: 'select', placeholder: t('shippingAddress.province'), dynamic: 50, isHide: true, verify: [{ required: true }] },
        { name: 'billing_postal_code', type: 'input', placeholder: t('shippingAddress.postalCode'), dynamic: 50, verify: [{ required: false }] },
        // { name: 'billing_phone', type: 'input', placeholder: 'Phone (For shipping updates)' },
    ]
}
const initBillingData = () => {
    return { billing_first_name: '', billing_last_name: '', billing_address1: '', billing_address2: '', billing_city: '', billing_country: '', billing_province: '', billing_postal_code: '' }
}
const loadscript = ({ url, id, obj, isPreload }, callback) => {//obj:加载成功后应该有的对象
    return new Promise((resolve, reject) => {
        if (url) {
            if (isPreload) {//如果是预加载，就只是加载
                let tag = document.createElement("link");
                tag.rel = 'preload';
                tag.href = url;
                tag.as = 'script';
                document.head.appendChild(tag);
            } else {
                let ids = id && document.getElementById(id);
                let tag = ids || document.createElement("script");
                tag.src = url;
                tag.id = id || '';
                document.body.appendChild(tag);
                try {
                    function has() {
                        if (obj) {
                            let num = 0;
                            var t = setInterval(hasObjFun, 15);
                            hasObjFun();
                            function hasObjFun() {
                                console.log(num, window[obj]);
                                if (window[obj]) {
                                    clearInterval(t);
                                    t = undefined;
                                    resolve(true);
                                    if (callback) callback();
                                } else {
                                    num++;
                                    if (num > 10) {
                                        clearInterval(t);
                                        t = undefined;
                                        reject();
                                        if (callback) callback();
                                    }
                                }
                            }
                        } else {
                            setTimeout(() => {
                                resolve(true);
                                if (callback) callback();
                            })
                        }
                    }
                    if (ids) {//已经渲染过这个script了 就直接返回resolve
                        has()
                    } else {//没有这个script就等他加载完成后返回
                        tag.onload = tag.onreadystatechange = (e) => {
                            has()
                        }
                    }
                } catch (err) {
                    console.log('err', err);
                    reject(err)
                }
            }
        } else {
            reject()
        }
    })
}
const currencyJson = {
    EUR: '€',
    GBP: '£',
    USD: 'US$',
    JPY: '￥',
    MXN: 'MXN$',
    CAD: 'CAD$',
    NZD: 'NZ$',
    AUD: 'AU$',
    HKD: 'HK$',
    THB: '฿',
    ILS: '₪',
    MYR: 'RM',
    PLN: 'zł',//波兰兹罗提
    RON: 'L',//罗马尼亚
    BRL: 'R$',//巴西
    NOK: 'kr',
    SEK: 'kr',
    DKK: 'kr',
    CLP: 'CL$',
    PEN: 'S/',
    AED: 'د.إ',//阿联酋
    CHF: '₣',//瑞士法郎
    RUB: '₽',//俄国卢布
    KRW: '‎₩',//韩国圆
    PHP: '‎₱',//菲律宾
    ZAR: '‎R',//南非
    SGD: '‎S$',//新加坡
    TRY: '‎₺',//土耳其里拉
    ISK: '‎kr',//冰岛克朗
    HUF: 'Ft',//匈牙利福林
    CZK: 'Kč',//捷克克朗
    BHD: 'د.ب',//巴林
    BGN: 'лв',//保加利亞
    KHR: '៛',//柬埔寨
    HRK: 'kn',//克罗地亚
    KZT: '₸',//哈萨克斯坦
    KWD: 'د.ك',//科威特
    LAK: '₭N',//老挝
    OMR: 'ر.ع',//阿曼
    QAR: 'ر.ق',//卡塔尔
    SAR: 'ر. س',//沙特阿拉伯
    VND: '₫',//越南
    ARS: 'AR$',//阿根廷比索
    IDR: 'Rps',//盾
    INR: 'Rs',//印度卢比
    JOD: 'د.أ',//约旦第纳尔(JOD)
    COP: '$COL',//哥伦比亚
}
const currencySymbol = (onCurrency) => {
    return currencyJson[onCurrency || order.currency] || '$';
}
const computShowDom = (type, _this) => {
    let { pay_type = 0, isSimplify = false, formData = {}, noStock, payment_gate_way, page = 0, gatewayCountryLoading, gatewayList = [] } = _this.state || {};//noStock:没有库存
    let { special_zero = false, payment_method } = formData || {};
    let { shop = {} } = window.shopify_checkouts || {};
    let { promotion_is_active, pay_pal_is_active, pay_pal_credit_is_active } = shop;//pay_pal_is_active是否显示pay_pal支付默认true
    let isOK = false;
    gatewayList = gatewayList || [];
    switch (type) {
        case 'hot':
            isOK = false;
            if (pay_type === 0 && promotion_is_active) {
                isOK = true
                if (((payment_gate_way === 'ocean_credit') && (page === 1))) {
                    isOK = false
                }
            }
            return isOK
        case 'fastPaypal':
            isOK = false;
            if (pay_pal_is_active && pay_type === 0 && !special_zero) {
                isOK = true;
                if ((payment_gate_way === 'ocean_credit') && (page === 1)) {
                    isOK = false
                }
            }
            if (noStock) {
                isOK = false
            };
            return isOK
        case 'pay_pal_credit':
            isOK = false;
            if (pay_pal_credit_is_active && pay_type === 0 && !special_zero) {
                isOK = true;
                if ((payment_gate_way === 'ocean_credit') && (page === 1)) {
                    isOK = false
                }
            }
            if (noStock) {
                isOK = false
            };
            return isOK
        case 'subBtn':
            isOK = true;//((payment_gate_way === 'ocean_credit') && (page === 1))
            if ((payment_gate_way === 'ocean_credit') && (page === 1)) {
                isOK = false
            }
            if (special_zero) {
                isOK = true
            };
            if (noStock) {
                isOK = false
            };
            return isOK;
        case 'paymentMethod':
            isOK = false;
            if (pay_type === 0 && !special_zero) {
                // if (!gatewayCountryLoading && pay_type === 0 && !special_zero) {
                isOK = true
                if ((payment_gate_way === 'ocean_credit') && (page === 0)) {
                    isOK = false
                }
                if (gatewayList.length === 0 || (gatewayList.length === 1 && gatewayList[0].payGateWay === 'fast_pay_pal')) {//如果没有或者只有一项，且这一项是fast_pay_pal
                    isOK = false
                }
            };
            return isOK
        default:
            return false
    }
}
const listenerGoogleKeyError = (data) => {//监听google密钥失效
    let { id, placeholder = '' } = data || {};
    if (!id) { return };
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === "attributes" && mutation.target.className.includes('gm-err-autocomplete')) {
                // mutation.target.classList.remove("gm-err-autocomplete");
                mutation.target.style = undefined;
                mutation.target.disabled = false;
                mutation.target.placeholder = placeholder;
                console.warn("googleKeyFailure");
                observer.disconnect();
            }
        });
    });
    observer.observe(id, {
        attributes: true, //监听属性的更改,
        // attributeOldValue:true,//记录变动前的数据
        attributeFilter: ['class']
    });
}
/**
 * 防抖当频繁触发时,只取最后一次
 * @param {key} 标记名称，必传
 * @param {callback} 回调
 * @param {timer} 延时时间，默认100ms
 */
let status = {};
const Debounce = async (key, callback, timer = 100) => {//key:次数标记
    return new Promise((resolve, reject) => {
        if (status[key] === undefined) {
            status[key] = 1
        } else {
            status[key]++
        };
        let old = status[key];
        setTimeout(() => {
            if (status[key] === old) {
                return resolve(callback && callback())
            }
        }, timer);
    })
}
/**
 * 节流，取第一次
 * @param {key} 标记名称，必传
 * @param {callback} 回调
 * @param {timer} 延时时间，默认100ms
 */
const Throttling = async (key, callback, timer = 100) => {//key:次数标记
    return new Promise((resolve, reject) => {
        if (status[key] === undefined) {
            status[key]++;
            return resolve(callback && callback())
        } else {
            setTimeout(() => {
                delete status[key];
            }, timer);
        };
    })
}
const getCookie = (key) => {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let kv = cookies[i].split('=')
        if (kv && kv.length > 1 && kv[0].toString().trim() === key) {
            return kv[1]
        }
    }
    return undefined
}

const init_on_payment_method = (state) => {//获取当前是哪一种payment_method
    if (state) {
        const { formData } = state;
        const { payment_gate_way } = formData;
        const { payment_method } = formData;
        if (payment_gate_way && payment_gate_way.includes('pay_pal')) {
            return 'PayPal'
        } else {
            return payment_method
        }
    } else {
        console.log('需要给init_on_payment_method方法传入state');
        return ''
    }
}

const currencySequence = (price, onCurrency = '') => {//货币符号显示位置调整
    //如果是number类型 就显示0.00
    if (price === 0) {
        price = '0.00'
    }
    let c = currencySymbol(onCurrency);
    if (c === '€') {//欧元
        return `${toAmountFormat(price, '.', ',') || '-'}${c}`
    } else if (c === '￥') {
        if (price) {
            price = parseFloat(price).toFixed(0)
        }
        return `${c}${toAmountFormat(price, ',') || '-'}`
    }
    else {
        return `${c}${price || '-'}`
    }
}
//12345.12 => 12(formater)345(decimalPoint)12
const toAmountFormat = (price, formater = ",", decimalPoint = ".") => {
    if (price) {
        const str = price.toString().replace(/\./, decimalPoint);
        const reg = str.indexOf(decimalPoint) > -1 ? new RegExp(`(\\d)(?=(\\d{3})+\\${decimalPoint})`, "ig") : /(\d)(?=(?:\d{3})+$)/g;
        return str.replace(reg, "$1" + formater);
    }
    return price
}

const cpfObj = ({ t, country = '', payment_method, onlyGetData = false }) => {//各国家cpf属性,这里可以控制那些国家显示cpf,onlyGetData:是否单纯只取数据
    country = country.toUpperCase() || '';
    let obj = {
        BR: { label: 'cpf', maxLength: 14, verify: [{ required: true }], placeholder: t(`paymentMethod.creditCard.CPF`) },//Brazil巴西//Length of 14 digits, numeric only.
        AR: { label: 'cpf', maxLength: 11, verify: [{ required: true }], placeholder: t(`paymentMethod.creditCard.CUIT/CUIL/CDI`) },//Argentina阿根廷//11位30-52135353-1
        // MX: {label:'cpf', maxLength: 20, verify: [{ required: false }], error: false, placeholder: t(`paymentMethod.creditCard.RfcPlaceholder`) },//墨西哥
        // PE: { label: 'cpf', maxLength: 11, verify: [{ required: false }], placeholder: t(`paymentMethod.creditCard.DNI`) },//PE/peru秘鲁 11位
        CL: { label: 'cpf', maxLength: 12, verify: [{ required: true }], placeholder: t(`paymentMethod.creditCard.RUT`) },//chile智利 12位
        CO: { label: 'cpf', maxLength: 15, verify: [{ required: true }], placeholder: 'NIT/CC' },//CO/Colombia哥伦比亚 15位
        UY: { label: 'cpf', maxLength: 12, verify: [{ required: true }], placeholder: 'REGEX' },//Uruguay乌拉圭 12位
    };
    if (country && onlyGetData) {
        return obj[country] || obj.BR;//onlyGetData如果是单纯拿数据，拿不到数据 就反个巴西的cpf，保证能让用户填写
    } else {
        let allC = ['BR', 'CL'];//都需要填的国家
        let ebanxC = [];//因为现在按卡BIN抛送了，ebanx时候也不一定最后是ebanx支付，所以取消ebanx时候的前端必填校验，改由后端校验
        // let ebanxC = ['CO', 'AR', 'UY'];//ebanx 必填的国家
        if (allC.includes(country) || (payment_method === 'Ebanx' && ebanxC.includes(country))) {
            return obj[country] || {};
        } else {
            return {};
        }
    }
};

// 获取页面信息
function getPageInfo() {
    if (!Object.keys(order).length) {
        return;
    }
    const traceInfo = {
        country: order.address && order.address.country_name,
        country_code: order.address && order.address.country,
        trans_id: order.trans_id,
        uuid: order.uuid,
        // platform_shop_id: shop.platform_id,
        shop_name: shop.name,
        domain: shop.domain,
        url: document.URL,
        title: document.title,
        referrer: document.referrer,
        screen_height: window.screen.height || 0,
        screen_width: window.screen.width || 0,
        lang: navigator.language,

    };

    if (navigator.userAgent) {
        let ua = parser(navigator.userAgent);
        traceInfo.bname = ua.browser && ua.browser.name;
        traceInfo.bver = ua.browser && ua.browser.version;
        traceInfo.osname = ua.os && ua.os.name;
        traceInfo.osver = (ua.os && ua.os.version) || "";
        traceInfo.devendor = (ua.device && ua.device.vendor) || "";
        traceInfo.demodel = (ua.device && ua.device.model) || "";
        traceInfo.detype = (ua.device && ua.device.type) || "";
    }
    return traceInfo;
}

const CPF_ERROR_CODE = ['BP-DR-98', 'BP-DR-23', 'BP-DR-22', 'BP-DOC-01', 'BP-DR-111', 'BP-REF-21'];//BP-DR-98税号不匹配，BP-DR-23税号错误,BP-DR-22/BP-DOC-01税号必填,BP-DR-111/BP-REF-21税号无法通过验证
const has_name_fun = (n = 'is_app', val = '1') => {//一个判断url或者sessionStorage上某个值是否为val的函数，同时会将结果加入sessionStorage备查
    // const n = 'is_app'
    const urlParams = getUrlParams(window.location.href);
    const url_is_app = urlParams[n];
    //先看url有没有
    if (url_is_app || url_is_app !== val) {//有就用url的并且存储
        window.sessionStorage.setItem(n, url_is_app);
        return url_is_app === val;
    } else {//没有就看sessionStorage
        const get_name = window.sessionStorage.getItem(n);
        return get_name === val;
    }
}
let IS_APP = has_name_fun('is_app');
const getTongdun = () => {//获取同盾key
    sessionStorage.removeItem("black_box");
    let { osname } = getPageInfo() || {};
    let appName = '';
    if (IS_APP) {
        if (osname === 'iOS') {
            appName = IS_PROD ? 'Starlink_ios' : 'Starlink_iostest';
        } else {
            appName = IS_PROD ? 'Starlink_and' : 'Starlink_andtest';
        }
    } else {
        appName = IS_PROD ? 'Starlink_web' : 'Starlink_wycs';
    }
    return new Promise((resolve, reject) => {
        window._fmOpt = {
            partner: 'Starlink',
            appName,
            token: `demo-${new Date().getTime()}-${Math.random().toString(16).substr(2)}`,
            fmb: true,
            fpHost: 'https://usfp.tongdun.net', // 北美设备指纹上报域名
            // fpHost: 'https://sgfp.tongdun.net', // 新加坡设备指纹上报域名
            behaviorUrl: 'https://behavior.tongdun.net',     // 北美⾏为采集上报域名   
            // behaviorUrl: 'https://sgbehavior.tongdun.net',     // 新加坡⾏为采集上报域名
            success: function (data) {
                // 在成功完成采集后，success回调中可以获取到black_box
                //这里可以设置客户需求的操作，传输black_box等操作
                //获取设备指纹黑盒数据，并提交到业务服务器
                resolve(data);
                sessionStorage.setItem("black_box", data)
            },
        };
        var fm = document.createElement('script'); fm.type = 'text/javascript'; fm.async = true; fm.src = 'https://static.tongdun.net/sg/fm.behavior.js?ver=0.1&t=' + (new Date().getTime() / 3600000).toFixed(0);
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(fm, s);
    })
}
let getStripeNeedData = (type = '') => {
    //处理stripe对接Apple Pay时候需要传的参数
    let { address, currency, all_price, items_subtotal_price, discounts = [], user_discounts = [], b_address } = order || {};
    let { domain = '' } = shop;
    let { country } = address || {};
    currency = currency.toLowerCase();
    let str = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'];//这些就是原始币种 否则就*100
    let arr = (domain && domain.split('.')) || [];
    let label = arr[1] || '';//支付商家名称
    if (!type && (!str.includes(currency.toUpperCase()))) {//ios端的价格不乘以100
        all_price = all_price ? parseFloat(Number.prototype.precision(all_price * 100, 0)) : 0
    }
    if (type === 'is_app') {//给各家app处理名字
        switch (label) {
            case 'soulmiacollection':
                label = 'Soulmia';
                break;
            default:
                break;
        }
    }
    return {
        // public_key:'xx',
        // client_secret:'xx',
        country,//国家简码
        currency,//货币简码
        label,//收款商家名称
        amount: all_price,//最终价格
        items_subtotal_price,//原价
        discounts,//各种折扣
        user_discounts,//当前项Online Payment Discount的优惠信息（支付渠道活动）
        b_address: (b_address || address),//当前项Online Payment Discount的优惠信息（支付渠道活动）
    }
}
const AppleGooglePay = async (data) => {
    const { publicKey, subData } = data || {};
    if (has_name_fun('is_app') && window._ios?.canApplePay === 1) {//如果是app且支持ApplePay
        return { appData: getStripeNeedData('is_app') }
    }
    if (!publicKey) { return };
    await loadscript({ url: 'https://js.stripe.com/v3/', id: 'AppleGooglePay_sdk', obj: 'Stripe' });
    if (!window.Stripe) { return };
    const stripe = window.Stripe(publicKey, {
        //   apiVersion: "2020-08-27",
    });
    let { country, currency, label, amount } = getStripeNeedData();
    const paymentRequest = stripe.paymentRequest({
        country,
        currency,
        total: {
            label,
            amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        // requestShipping: true,
        // requestPayerPhone: true,
    });
    const result = await paymentRequest.canMakePayment();
    console.log('result',result);
    // $('#test1').text(`result：${JSON.stringify(result)}`);
    if (result && result.applePay) {
        return { paymentRequest, stripe }
    } else {
        return null
    }
};
/**
 * 获取3ds信息
 */
const get3ds = () => {
    let info = {};
    try {
        info.javaEnabled = navigator.javaEnabled();
        info.colorDepth = screen.colorDepth;
        info.screenWidth = screen.width;
        info.screenHeight = screen.height;
        info.timeZoneOffset = new Date().getTimezoneOffset();
        info.systemLanguage = navigator.language;
    } catch (error) {
    }
    return info
}

/**
 * 匹配语言适配器
 * @param {string} lng 
 * @returns 
 */
export const atapterLang = (lng = '') => {
    let lang = (lng || document.documentElement.lang || (window.shopify_checkouts && window.shopify_checkouts.language) || 'en').toLocaleLowerCase();
    lang = lang === 'en' ? 'en-US' : lang
    lang = (lang === "de-de" ? 'de' : lang);
    lang = (lang === 'pt' || lang === 'pt-pt') ? 'pt-BR' : lang
    return lang
}

const handleQuery = function (selector, context) {
    var idSelectorRE = /^#([\w-]+)$/;
    var classSelectorRE = /^\.([\w-]+)$/;
    var tagSelectorRE = /^[\w-]+$/;
    var element = null;
    if (idSelectorRE.test(selector)) {
        element = context.getElementById(selector.substring(1));
    } else if (classSelectorRE.test(selector)) {
        element = context.getElementsByClassName(selector.substring(1))[0];
    } else if (tagSelectorRE.test(selector)) {
        element = context.getElementsByTagName(selector)[0];
    }
    return element;
};

/**
 * querySelector兼容
 * @param {dom} selector 
 * @returns 
 */
export const querySelector = (selector) => {
    var element = null;
    if (document.querySelector) {
        element = document.querySelector(selector);
    } else {
        var selectors = selector.split(' ');
        var context = document;
        for (var i = 0, len = selectors.length; i < len; i++) {
            context = handleQuery(selectors[i], context);
        }
        element = context;
    }
    return element;
}


const { osname } = getPageInfo()

const devicePlatform = function () {
    if (has_name_fun('is_app')) {
        return `webview-${osname}`
    }
    return `web-${osname && osname.toLocaleLowerCase()}`
}

const deviceName = devicePlatform()

/**
 * 统计触发事件
 * @param eventName  事件名称
 * @param data 自定义数据
 */
export function trigger(eventName, data = {}) {
    //没用了 暂时不要了2021.12.18，过段时间去掉
    //https://starlink.feishu.cn/docs/doccnIWDTughmH5EKfkRu5srSyg
    // time是用于pixel事件统计相同数据时，上报不会被收集问题
    // let options = Object.assign({},
    //     {
    //         time: new Date().format('yyyy-MM-dd hh:mm:ss'), // 上报时间
    //         shopName: name, // 应用名称
    //         transId,
    //         orderNumber,
    //         lang,
    //         defaultCountry,
    //         deviceName,
    //         uuid,
    //         identityCode
    //     },
    //     data)

    // // if (window.fbq) {

    // //     /* Pixel 上报 */
    // //     try {
    // //         // pixel
    // //         fbq('track', eventName, options)
    // //     } catch (e) {
    // //         console.log('pixel no install', e)
    // //     }
    // // }

    // if (window.gtag) {

    //     /* Gtag 上报 */
    //     try {

    //         // GTAG
    //         gtag('event', eventName, options)
    //     } catch (e) {
    //         console.log('ga no install')
    //     }
    // }
}
/**
 * 统计触发事件gtm第二版本
 * @param data 自定义数据
 */
function gtmTrigger(data = {}) {
    let options = Object.assign({},
        {
            event: "uaEvent",
            eventCategory: "Checkout",
            nonInteraction: false
        },
        data)
    if (IS_APP) {
        try {
            eventPayment(options);
        } catch (e) {
            console.log('app eventPayment error')
        }
    }
    if (window.dataLayer) {
        try {
            window.dataLayer.push(options);
        } catch (e) {
            console.log('ga no install')
        }
    }
    // if ((platform_name === 'MIDDLEEAST') && (order_domain && order_domain.includes('m.adorawe'))) {
    //     if (window.dataLayer) {
    //         try {
    //             window.dataLayer.push(options);
    //         } catch (e) {
    //             console.log('ga no install')
    //         }
    //     }
    // }//目前只监控中东的M端
}
/**
 * 监听dom边界框改变(高宽)，chrome64版本开始才支持，慎用
 * @param el  要监听的dom
 * @param callback dom变化后的回调
 */
function observerDom(el, callback) {
    try {
        if (el && callback) {
            const resizeObserver = new ResizeObserver(entries => {
                // 监测到高度变化后需要处理的逻辑
                callback(entries);
            });
            resizeObserver.observe(el)
        }
    } catch (error) {
        console.log('ResizeObserver', error);
    }
}
/**
 * 卡片名称前后端转化
 * @param val 后端给的名称
 */
const initCardIocn = (val = '') => {
    switch (val) {
        case 'VISA':
            return 'visa';
        case 'MASTER':
            return 'mastercard';
        case 'DISCOVER':
            return 'discover';
        case 'DINERS CLUB':
            return 'dinersclub';
        case 'AMEX':
            return 'amex';
        case 'CARTE BLEUE'://没有图标
            return 'card_number';
        case 'MADA':
            return 'mada';
        case 'ELO':
            return 'elo';
        case 'HIPERCARD':
            return 'hipercard';
        case 'CARNET':
            return 'carnet';
        case 'PRESTO':
            return 'card_number';
        case 'JCB':
            return 'jcb';
        default:
            return 'card_number'
    }
}
const InitMessage = (mess) => {//处理空格和句号;
    if (mess) {
        mess = mess.toLocaleLowerCase().trim() || '';
        let lastStr = (mess.slice(-1));
        if (lastStr === '.' || lastStr === '。') {
            mess = mess.slice(0, -1)
        };
    }
    return mess;
}
export { gtmTrigger, InitMessage, initCardIocn, observerDom, has_name_fun, getStripeNeedData, get3ds, AppleGooglePay, getTongdun, scrollToId, IS_APP, CPF_ERROR_CODE, currencySequence, cpfObj, funverify, rule, initBillingAddress, initBillingData, currencySymbol, loadscript, computShowDom, listenerGoogleKeyError, Debounce, Throttling, getCookie, init_on_payment_method, getPageInfo }
