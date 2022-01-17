import React, { Component } from "react";

import { withTranslation } from "react-i18next";
import styles from './App.module.scss';

import { Sicon, Feedback, Sinput, Skeleton, Sback, Sbutton, Sloading, Slist, Salert, Stips, Stooltip, Smodal } from '../compoents';
import { NoPayment, Cards, RenderCardImg, Header, ApplePay, HeaderTop } from "../compoents/apps"
import { payNowApplePayAction, applePayCallbackAction } from '../jsBridge'

import classNames from 'classnames';
import 'rc-dialog/assets/index.css';
// import testArr from "./compoents/apps/shipping-zone"
import { get_click_back, checkout_deal, get_all_country, get_all_province, get_shipping_zones, harbor_shipping_method, get_gateway_country, get_group_gateway_country, get_paypal_shipping_info, update_draft_order, refresh_inventory, page_loaded } from "../api/api"
import { gtmTrigger, InitMessage, initCardIocn, observerDom, trigger, AppleGooglePay, getTongdun, scrollToId, IS_APP, CPF_ERROR_CODE, cpfObj, funverify, rule, computShowDom, listenerGoogleKeyError, currencySymbol, currencySequence } from "../utils"

// const isDev = (process.env.NODE_ENV === 'development');
// import { update_ui_version } from "../api/api"
import { reportError } from "../utils/logger"
import Pubsub from "../utils/pubsub"
import BzLogReporter from "../utils/bzLogReporter"
import { getChgLanguageParams } from '../utils/languageChg'
import { ShippingFormatedAddress } from "../utils/shippingAddress";

const __sl_checkout_shippingaddr__ = JSON.parse(localStorage.getItem('__sl_checkout_shippingaddr__') || '{}');
let HAS_SHIPINGADDR = (__sl_checkout_shippingaddr__.email ? true : false);
const isMobile = document.body.clientWidth < 750;
const SUCCESS_SUBMIT_KEY = '__chk_old_uuid';//用于判断是否成功提交过
const OPENED_MODAL_KEY = '__opened_modal_uuid_';//用于判断是否打开过paypal提示框{xxxgateway:1}
const CAN_CLICK_BACK = '__can_click_back';//用于记录允许返回到收银台的订单,重新返回到收银台时删除记录
let subFalg = false;//控制按钮
class Index extends Component {
    constructor({ t, i18n }) {
        super();
        const { shop = {} } = window.shopify_checkouts || {};
        this.isMIDDLE = (shop?.name === 'vivaiacollection_ar' || shop?.name === 'adorawe');//是中东
        this.state = {
            shippingAddress: [//原始form数据
                { name: t('contactInfo.label'), type: 'title' },
                { name: 'email', type: 'input', types: 'email', placeholder: t('contactInfo.emailOrPhone'), verify: [{ required: true }] },
                // { name: 'email', type: 'input', types: 'email', placeholder: t('contactInfo.emailOrPhone'), verify: [{ required: true }, { pattern: rule.email, message: 'error email' }] },
                { name: 'subscribe', type: 'checkbox', placeholder: t('contactInfo.keepMeUpto') },
                { name: t('shippingAddress.label'), type: 'title' },
                { name: 'first_name', type: 'input', placeholder: t('shippingAddress.firstName'), dynamic: 50, verify: [{ required: true }], maxLength: 50 },
                { name: 'last_name', type: 'input', placeholder: t('shippingAddress.lastName'), dynamic: 50, verify: [{ required: true }], maxLength: 50 },
                { name: 'address1', type: 'input', placeholder: t('shippingAddress.address'), verify: [{ required: true }] },
                { name: 'address2', type: 'input', placeholder: t('shippingAddress.apartment') },
                { name: 'city', type: 'input', placeholder: t('shippingAddress.city'), verify: [{ required: true }] },
                {
                    name: 'country', type: 'select', placeholder: t('shippingAddress.countryRegion'), dynamic: 50, option: [], verify: [{ required: true }]
                },
                { name: 'province', type: 'select', placeholder: t('shippingAddress.province'), dynamic: 50, option: [], isHide: true, verify: [{ required: true }] },
                { name: 'postal_code', type: 'input', placeholder: t('shippingAddress.postalCode'), dynamic: 50, verify: [{ required: false }] },
                { name: 'phone', type: 'input', types: 'tel', placeholder: t('shippingAddress.phone'), verify: [{ required: true }] },
                // { name: 'phone', type: 'input', types: 'tel', placeholder: t('shippingAddress.phone'), verify: [{ required: true }, { pattern: rule.phone, message: 'error phone' }] },
                { name: '__sl_checkout_shippingaddr__', type: 'checkbox', placeholder: t('saveInformation') },

            ],
            shippingMethod: [//原始form数据
                { name: t('shippingMethod.label'), type: 'title' },
                { name: 'shipping_rate_id', type: 'addressSelection', placeholder: 'address selection', verify: [{ required: true }] },
            ],
            cpfItme: [
                { name: 'cpf', type: 'input', isHide: true, maxLength: 12, verify: [{ required: true }] },
                { name: 'email', type: 'input', isHide: true, types: 'email', placeholder: t('contactInfo.emailOrPhone'), verify: [{ required: true }, { pattern: rule.email, message: 'error email' }] }
            ],
            formItme: [],//实际使用的form
            formData: { cpf: '', special_zero: false, shipping_rate_id: '', shipping_child_id: '', email: '', subscribe: true, first_name: '', last_name: '', address1: '', address2: '', city: '', country: '', province: '', province_name: '', postal_code: '', phone: '', __sl_checkout_shippingaddr__: false, payment_method: '', payment_gate_way: '' },
            visible: false,
            shipping_zones: [],
            subLoading: false,
            // payment_gate_way: 'normal_pay_pal',//pacpay_credit、Ebanx_credit、worldpay_credit、adyen_credit、checkout_credit：线上返回的
            gatewayList: [
                // { payMethod: "Checkout", payGateWay: "credit", publicKey: "pk_test_61801af3-d323-44f9-a42a-82669df3bdcb" },
                // { payMethod: "Ebanx", payGateWay: "oxxo", publicKey: "" },
                { payMethod: "PacyPay", payGateWay: "credit", publicKey: "", payName: "PacyPay-credit" },
                { payMethod: "PayPal", payGateWay: "fast_pay_pal", publicKey: "", payName: "PayPal-fast_pay_pal" },
                { payMethod: "PayPal", payGateWay: "pay_pal_credit", publicKey: "", payName: "PayPal-fast_pay_pal" },
            ],
            // gatewayList:[],//get_gateway_country请求返回的所有参数，主要使用其中各种key，adyen、checkout……
            simplifyList: [],
            isSimplify: false,//是否显示简化地址
            // country_name: '',//需要保存于localstorage的数据.现在合并到__sl_checkout_shippingaddr__里了
            shippingMethodLoading: true,//邮费接口是否在加载中
            pay_type: 0,//标识用户是那种支付，1:快捷支付，0是非快捷支付
            gatewayCountryLoading: true,
            countryOption: [],//国家列表
            paymentAlert: '',
            sub_error_obj: {},
            shipping_method_list: [],//地址备选项
            noStock: false,//是否有0库存宝贝
            shipping_not_change: false,//不能更改邮费，默认可以更改
            subDisabled: false,
            paymentLoadError: false,//该支付方式载入失败，在切换支付方式的时候应该恢复false
            modalVisible: false,//modal是否显示
            modalText: '',//modal显示内容
            subSuccessData: { "Stripe-apple_pay": null },//只提交时候保存收到的数据，数据用于Apple Pay支付
            beforSub: ['Stripe-apple_pay'],//需要提前请求的支付方式
            // special_zero:false,//是否是0元购,放到formData里去了
            instalmentsItem: undefined,//选中的分期项
            credits: ['credit', 'mada_credit'],
            onGateWayItem: {},//当前选中项
        }
        // this.successSubmitKey = '__chk_old_uuid'
    }
    UNSAFE_componentWillMount() {
        let { formData, onGateWayItem } = this.state;
        const { t } = this.props;
        let { order = {}, error_msg = '' } = window.shopify_checkouts || {};
        let { address, email, shipping_rate_id, shipping_child_id, uuid, currency, cpf, payment_method, payment_gate_way, total_price, language } = order || {};

        if (window.shopify_checkouts.order) {
            language = (language || 'en').toLocaleLowerCase();
            language = (language === 'en' || language === 'en-us') ? 'en' : language
            language = (language === "de-de" ? 'de' : language);
            language = (language === 'pt' || language === 'pt-pt') ? 'pt' : language;
            window.shopify_checkouts.order.language = language;
        }
        onGateWayItem.currency = currency;
        onGateWayItem.payPrice = Number.prototype.precision(total_price);
        // 若缓存里有 就优先用缓存的，避免用户点击返回 取到老数据
        let session_payment_gate_way = window.sessionStorage.getItem('payment_gate_way');
        let session_payment_method = window.sessionStorage.getItem('payment_method');
        if (session_payment_gate_way) {
            payment_gate_way = session_payment_gate_way;
            window.sessionStorage.removeItem('payment_gate_way')
        }
        if (session_payment_method) {
            payment_method = session_payment_method;
            window.sessionStorage.removeItem('payment_method')
        }
        //添加需要提前渲染数据的情况
        let obj = {};
        //渲染本地数据
        if (HAS_SHIPINGADDR) {//初始化时检查是否需要初始化本地ShippingAddress数据
            obj = __sl_checkout_shippingaddr__;
        }
        if (!shipping_rate_id || shipping_rate_id === 0) {
            shipping_rate_id = '';
        };
        // this.refresh_inventory_fun();
        //渲染服务端数据
        if (address && typeof (address) === 'object') {
            let str = ['first_name', 'last_name', 'address1', 'address2', 'city', 'country', 'country_name', 'province', 'province_name', 'postal_code', 'phone'];
            let newShipping_rate_id = `${shipping_rate_id}`;
            if (shipping_child_id) {
                newShipping_rate_id = `${shipping_rate_id}-${shipping_child_id}`
            }
            str.forEach(key => {
                obj[key] = address[key] || '';
            })
            obj = Object.assign(obj, { email, shipping_rate_id: newShipping_rate_id, cpf });
            HAS_SHIPINGADDR = true;
            this.setCardholderName(formData);
        }
        payment_gate_way && (formData.payment_gate_way = payment_gate_way);//如果有默认选中项 就让他选中
        payment_method && (formData.payment_method = payment_method);//如果有默认选中项 就让他选中
        payment_gate_way && payment_method && (formData.payName = `${payment_method}-${payment_gate_way}`);//如果有默认选中项 就让他选中
        let i18nMessage = `cardError.${InitMessage(error_msg)}`;
        let paymentAlert = (t(i18nMessage) === i18nMessage ? error_msg : t(i18nMessage))//如果在cardError里匹配不到错误信息，就显示原始信息
        this.setState({ formData: Object.assign(formData, obj), paymentAlert }, () => {
            !cpf && this.detectionCpf()//没有cpf才去检查需不需要cpf
            if (HAS_SHIPINGADDR && !(address && typeof (address) === 'object')) {//如果有本地数据，但没有远程数据，就保存一次到远端
                this.onBlurUpdateOrder()
            }
        });
        //处理用户重新返回收银台的逻辑
        this.userBack(uuid);
        // console.log('will mount...')
        // if (uuid && ui_version !== 'c') {
        // 	update_ui_version({ uuid, ui_version: 'c' })
        // }
    }
    /**
     * 处理用户重新返回收银台的逻辑
     */
    userBack = (uuid) => {
        //用document.referrer来对比 不准
        let can_back = window.sessionStorage.getItem(CAN_CLICK_BACK);
        if (can_back) {
            if (can_back === uuid) {
                //如果用户重新返回了收银台，则记录到服务器
                get_click_back()
            };
            //进入页面后就可以删掉了
            window.sessionStorage.removeItem(CAN_CLICK_BACK);
        }
    }
    resize = () => {
        if (document.documentElement.clientWidth < 750) {
            document.documentElement.style.fontSize = document.documentElement.clientWidth / 23.4375 + 'px'
            return
        }
        document.documentElement.style.fontSize = '16px'
    }


    componentDidMount() {
        this.resize();
        // window.onresize = () => {
        // 	this.resize();
        // };
        this.currentLng = (document.documentElement.lang || 'en').toLocaleLowerCase();
        window.currentLng = this.currentLng;
        this.CountDown();
        this.getLocal('init', () => {
            this.promiseAll();//初始化时候，以下两种都加载完成再执行
            // this.getCountryOption();
        });
        // setTimeout(() => {
        //     //send facebook pixel events
        //     this.sendFacebookOtherEvents();
        // })

        if (window.shopify_checkouts) {
            const { order } = window.shopify_checkouts;
            page_loaded({ uuid: order.uuid });
            trigger('CheckoutPageLoaded')
        }

        window.onerror = function (message, source, lineno, colno, error) {
            reportError("window.onerror", message)
        }
        try {
            getTongdun()
        } catch (error) {
            reportError("tongdun", error)
        }
        this.setPaymentLoadError();//子组件中不支持的支付方式时候的监听函数
        this.PubInstalmentsItem = Pubsub.subscribe('instalmentsItem', (type, instalmentsItem) => {
            const { order } = window.shopify_checkouts;
            let { onGateWayItem } = this.state;
            if (instalmentsItem && (instalmentsItem instanceof Object)) {
                const { totalAmount = 0, currency } = instalmentsItem || {};
                onGateWayItem = Object.assign({}, onGateWayItem, { payPrice: totalAmount, currency: currency || order.currency });//选择分期后 修改对应的显示金额和货币
                if (instalmentsItem.periodNumber > 1) {
                    this.setState({ instalmentsItem, onGateWayItem });
                } else {
                    this.setState({ instalmentsItem: undefined, onGateWayItem });
                }
            } else {
                this.setState({ instalmentsItem: undefined })
            }
        });

        //初始化日志上报
        (new BzLogReporter()).init()
    }
    setPaymentLoadError = () => {//子组件中不支持的支付方式时候的监听函数
        let { t } = this.props;
        this.PubSetPaymentLoadError = Pubsub.subscribe('setPaymentLoadError', (type, data) => {
            this.setState({ paymentLoadError: true, modalVisible: true, modalText: t('paymentMethod.changePayment') })
        });
    }
    createPaypalButton = () => {
        let paypalBtn = document.getElementById('paypal-button-container');
        if (!paypalBtn || (paypalBtn && paypalBtn.firstChild) || !window.paypal) { return }//如果有了 就不再生成了
        try {
            let FUNDING_SOURCES = [
                paypal.FUNDING.PAYPAL,
                // paypal.FUNDING.VENMO,
                // paypal.FUNDING.CREDIT,
                // paypal.FUNDING.CARD,
            ];
            FUNDING_SOURCES.forEach((fundingSource) => {
                // Initialize the buttons
                // var localeMap = {
                // 	"ar": "ar-AE",
                // 	"de": "de-DE",
                // 	"en": "en-US",
                // 	"es": "es-ES",
                // 	"fr": "fr-FR",
                // 	"ja": "ja-JP",
                // 	"pt": "pt-BR",
                // }
                var button = paypal.Buttons({
                    // locale: localeMap[this.currentLng],
                    // fundingSource,
                    commit: true,
                    style: {
                        shape: 'pill',//形状rect
                        height: 40,
                        // size : 'small',
                        color: 'blue',//默认gold
                        // label: 'paypal',
                        // tagline:false,//禁用标语文字
                        layout: 'vertical',//vertical/horizontal布局，在多按钮的时候有效
                        // tagline:false,//是否显示下边的说明文字，一个按钮时候生效
                    },
                    createOrder: (data, actions) => {
                        // This function sets up the details of the transaction, including the amount and line item details.
                        let { onGateWayItem, formData, subDisabled } = this.state;
                        let { t } = this.props;
                        let { order = {}, shop = {} } = window.shopify_checkouts || {};
                        let { currency, address } = order || {};
                        let { address1, address2, province_name, province, city, postal_code, country } = address || {};
                        let amount = {
                            value: onGateWayItem?.payPrice,
                            currency_code: onGateWayItem?.currency || currency,
                        };
                        // if(!city){//city必填的
                        // 	console.log('city',city);
                        // 	this.setState({paymentAlert: t('convertedUSD')});
                        // 	return
                        // }
                        if (subDisabled) { return };//如果不允许点击
                        this.onclickSub(formData, 'pay_pal');
                        trigger('CheckoutSubmitClickPayPalCreateOrder');
                        if (this.onsubmitVerifyFun()) { //验证参数
                            return actions.order.create({
                                purchase_units: [{
                                    amount,
                                    shipping: {
                                        address: {
                                            address_line_1: address1,
                                            address_line_2: address2,
                                            admin_area_2: city,//城市
                                            admin_area_1: province_name || province,//省
                                            postal_code: postal_code,
                                            country_code: country,
                                        }
                                    },
                                    custom_id: `opchkspy-${shop.name.replace('.myshopify.com', '')}`,
                                }],
                                application_context: {
                                    shipping_preference: 'SET_PROVIDED_ADDRESS'//GET_FROM_FILE、NO_SHIPPING、SET_PROVIDED_ADDRESS
                                }
                            });
                        } else { return };
                    },
                    onApprove: (data = {}, actions) => {
                        const { orderID, facilitatorAccessToken } = data || {};
                        if (!orderID) { return };
                        trigger('CheckoutSubmitPayPalOnApprove', { orderID, facilitatorAccessToken });
                        this.setState({ visible: true });
                        this.notInitAddress({ order_id: orderID, access_token: facilitatorAccessToken });
                    },
                    onError: (e) => {
                        trigger('CheckoutFastPaypalError', { meassge: e });
                        console.log('onError', e);
                    }
                });

                // Check if the button is eligible
                if (button.isEligible()) {
                    // Render the standalone button for that funding source
                    button.render("#paypal-button-container");
                    let payNowHeight = this.payNow && this.payNow.offsetHeight;
                    if (payNowHeight) {
                        this.mo_main.style.paddingBottom = `${payNowHeight}px`
                    }
                    observerDom(this.payNow, (e) => {
                        let payNowHeight1 = this.payNow && this.payNow.offsetHeight;
                        this.mo_main.style.paddingBottom = `${payNowHeight1}px`;
                    })
                    // const { formData } = this.state;
                    // const { country } = formData || {};
                    // if (country === "US") {
                    // 	setTimeout(() => {
                    // 		let payNowHeight1 = this.payNow && this.payNow.offsetHeight;
                    // 		if (payNowHeight1) {
                    // 			this.mo_main.style.paddingBottom = `${payNowHeight1}px`
                    // 		}
                    // 	}, 1000)
                    // }
                }
            });
        } catch (error) {
            reportError("createPaypalButton", error);
            console.log("createPaypalButton", error);
            return true
        }
    }
    notInitAddress = (obj) => {
        let { formData = {} } = this.state;
        this.setState({ formData, paymentAlert: '', subLoading: true }, () => {
            let finalData = Object.assign({}, formData, obj, { payment_method: 'PayPal', payment_gate_way: 'fast_pay_pal' });
            this.post_checkout_deal(finalData, 'pay_pal')
        });
    }
    cpfErrorSet = (err) => {//cpf错误时候的处理
        let { message, message_key } = err;
        let { cpfItme } = this.state;
        cpfItme.forEach((item) => {
            item.error = false;
            if (message_key === 'BP-DR-98') {//BP-DR-98税号不匹配
                if (item.name === 'email') {
                    item.isHide = false;
                    item.error = true;
                    item.message = err.message;
                    scrollToId('email');
                }
            } else {
                if (item.name === 'cpf') {
                    item.isHide = false;
                    item.error = true;
                    item.message = err.message;
                    scrollToId('cpf');
                }
            }
            this.setState({ cpfItme }, () => {
                this.detectionCpf({ onlyGetData: true });
            });
        });
    }
    detectionCpf = (data) => {
        //检测是否需要显示cpf
        let { onlyGetData = false } = data || {};
        let { t } = this.props;
        let { cpfItme, formData } = this.state;
        let { country, payment_method } = formData;
        let oncpfObj = cpfObj({ t, country, payment_method, onlyGetData });
        if (oncpfObj.label) {
            let cpfItem = cpfItme.find(item => item.name === 'cpf');
            if (cpfItem) {
                cpfItem = Object.assign(cpfItem, oncpfObj);
                cpfItem.isHide = false
            }
            this.setState({ cpfItme });
        }
    }
    initCpf = () => {//恢复cpf
        let { cpfItme, formData } = this.state;
        let { order = {} } = window.shopify_checkouts || {};
        let { email, cpf, } = order || {};
        formData.cpf = cpf;
        formData.email = email;
        cpfItme.forEach(item => {
            item.error = false;
            item.isHide = true;
        });
        this.setState({ cpfItme, formData }, () => {
            !formData.cpf && this.detectionCpf();
        });
    }
    //检查是否有0库存
    refresh_inventory_fun = async () => {
        const { t } = this.props;
        let { order = {} } = window.shopify_checkouts || {};
        const { items = [], uuid } = order;
        refresh_inventory({ uuid }).then(res => {
            if (res && res.length) {
                items && items.length > 0 && items.forEach(item => {
                    if (res.includes(item.variant_id)) {
                        item.noStock = true;
                    }
                });
                this.setState({ paymentAlert: t('hasNoStock'), noStock: true });
            }
        })
    }

    get_harbor_shipping_method = async () => {//shopify之外的类型获取邮费列表
        let { formData = {} } = this.state;
        if (!formData.country) { return }
        this.setState({ shippingMethodLoading: true });
        let { order = {} } = window.shopify_checkouts || {};
        let { shippingMethods = [] } = order;
        let shipping_method_list = [];
        // formData.shipping_rate_id = '';//移动到了上层函数postageFun统一处理
        shippingMethods && shippingMethods.length > 0 && shippingMethods.forEach(item => {
            shipping_method_list.push({ shipping_rate_id: `${item.id}`, price: item.price || 0, name: item.methodName || '' });
        })
        this.setState({ shipping_method_list, shippingMethodLoading: false, shipping_not_change: true });
    };
    //获取每一种支付方式对应的国家表
    getGatewayCountry = async (type = 'init', country_code, province = '') => {//type：update
        const { shop = {}, order = {} } = window.shopify_checkouts || {};
        const { identity_code = '' } = shop;
        const { uuid } = order || {};
        let { formData, pay_type, onGateWayItem } = this.state;
        if (pay_type === 1) { return };
        this.setState({ gatewayCountryLoading: true });
        get_group_gateway_country({ identity_code, country_code: (country_code || formData.country), origin_host: location.origin, uuid }).then(res => {
            if (res && (res instanceof Array) && res.length) {
                let gatewayList = [];
                res.forEach(item => {
                    item.payName = `${item.payMethod}-${item.payGateWay}`;
                    if ((item.payGateWay === formData.payment_gate_way) && (item.payMethod === formData.payment_method)) {
                        onGateWayItem = item
                    }
                    if ((item.payMethod === 'Checkout') && (item.payGateWay === 'credit') && (formData.country === 'SA')) {//如果是沙特 就单独添加一项
                        let bindC = [], mada_bindC = [];//区分mada卡
                        let bindCards = item.bindCards || [];
                        if (bindCards.length) {//如果有绑卡
                            bindCards.forEach(it => {
                                if (initCardIocn(it.brand) === 'mada') {
                                    mada_bindC.push(it);
                                } else {
                                    bindC.push(it);
                                }
                            });
                        };
                        gatewayList.push({ ...item, bindCards: bindC });
                        gatewayList.push({ ...item, payGateWay: "mada_credit", bindCards: mada_bindC, payName: `${item.payMethod}-mada_credit` });
                    } else {
                        gatewayList.push(item);
                    }
                });
                if (!onGateWayItem || !onGateWayItem.payGateWay) {
                    onGateWayItem = gatewayList[0];
                    formData.payment_gate_way = gatewayList[0].payGateWay;
                    formData.payment_method = gatewayList[0].payMethod;
                    formData.payName = gatewayList[0].payName;
                }
                this.setState({ gatewayList, formData, subDisabled: false, onGateWayItem, gatewayCountryLoading: false }, () => {
                    this.sinputChangetoPayment_gate_way(undefined, 'first');
                    HAS_SHIPINGADDR && this.setCardholderName(formData);//若本地有数据就设置信用卡数据
                });
            } else {
                throw res || ''
            }
        }).catch(err => {
            this.setState({ gatewayList: [], subDisabled: true, onGateWayItem: {}, gatewayCountryLoading: false });//gatewayList: [], 等后期该接口数据合并到初始化数据里去的时候再用
            console.log('get_group_gateway_country——catch', err);
            reportError("gatewayList is null", err)
        }).finally(() => {
            this.setState({ gatewayCountryLoading: false });
            this.createPaypalButton();
        })
    }
    /**
     * 根据本地数据回填
     * 制作简化版地址显示
     */
    getLocal = async (type = 'init', callback) => {
        let { shippingMethod, shippingAddress, formData } = this.state;
        let { order = {} } = window.shopify_checkouts || {};
        let { uuid, address, shippingMethods = [] } = order || {};
        shippingMethods = shippingMethods || [];
        let s_L1 = shippingMethods.length > 0 && shippingMethods[0];//写死的地址第一项
        formData.uuid = uuid;
        const { t } = this.props
        let btnText = t('change');
        let shipping_text;//邮费信息的文本list项，有就推入
        if (address && (address.can_changed === false)) {
            btnText = '';
            if (s_L1) {
                shipping_text = { title: t('shippingMethod.label'), content: `${s_L1.methodName || ''}, ${(s_L1.price * 1) > 0 ? currencySequence(s_L1.price) : t('Free')}`, btnText: '' };
            }
        }
        let { country_name = '', province = '', province_name = '', postal_code = '', email, country } = formData || {};
        if (HAS_SHIPINGADDR) {//有本地数据
            let simplifyList = [];
            if (email) {
                simplifyList.push({ title: t('Contact'), content: email, btnText });
            };
            let items = ['address2', 'address1', 'city'];
            let shipTo = [], shipToString = '';
            items.forEach(item => {
                formData[item] && shipTo.push(formData[item]);
            });
            shipToString = `${shipTo.toString() || ''} ${province_name || province} ${postal_code}, ${country_name}`;
            simplifyList.push({ title: t('ShipTo'), content: shipToString, btnText });
            shipping_text && simplifyList.push(shipping_text);//这里推了，formItme里的地址项就置空，如下
            this.setState({ isSimplify: true, simplifyList, formItme: shipping_text ? [] : shippingMethod, formData }, () => {
                return callback && callback();
            });
        } else {
            formData.country = country || await this.initCountry();
            this.setState({ isSimplify: false, formItme: [...shippingAddress, ...shippingMethod], formData }, () => {
                return callback && callback()
            });
        }
    }
    /**
     * 根据shopify_checkouts数据计算默认国家
     */
    initCountry = async () => {
        let { order = {}, shop = {} } = window.shopify_checkouts || {};
        let { default_country } = shop;
        let { language } = order;
        const countryJson = {
            'en': 'US',
            'en-US': 'US',
            'de': 'DE',
            'es': 'ES',
            'fr': 'FR',
        };
        return default_country || countryJson[language] || ''
    }
    getCountryOption = async () => {//获取国家
        let { shippingAddress, formItme, formData, countryOption } = this.state;
        let await_country = !!formData.country//是否要等待get_all_country执行完
        if (await_country) {
            this.getProvinceOption('init', formData.country);
            this.getGatewayCountry('init', formData.country, formData.province || '');
        }
        get_all_country({ language: this.currentLng }).then((res = []) => {
            let formItmeCountry = formItme.find(item => item.name === 'country');
            shippingAddress.find(item => item.name === 'country').option = res || [];
            countryOption = res || [];
            formItmeCountry && (formItmeCountry.option = res || []);
            if (res && res[0]) {
                formData.country = formData.country || res[0].code;
                //初始化处理特殊国家
                !formData.country_name && (formData.country_name = ((res.find(item => item.code === formData.country) || {}).name) || '');
                this.setState({ shippingAddress, formItme, formData, countryOption });
                if (!await_country) {
                    this.getProvinceOption('init', formData.country);
                    this.getGatewayCountry('init', formData.country, formData.province || '');
                }
            }
        }).catch(err => {
            reportError("getCountryOption", err)
        }).finally(e => {
        })
    }
    getProvinceOption = async (type, code, newProvince = '') => {//获取省
        if (!code) { return };
        let { shippingAddress, formItme, formData, } = this.state;
        let { province, province_name } = formData;
        province = newProvince || province;
        let provinceObj = formItme.find(item => item.name === 'province');
        if (!provinceObj) {//如果formItme(当前显示项)没有province，就不往下走了,初始化时候postageFun已经在promiseAll执行了
            type !== 'init' && this.postageFun();
            return;
        }
        provinceObj.isHide = true;
        provinceObj.option = [];
        get_all_province({ code, language: this.currentLng }).then((res = []) => {
            let resLength = res && res.length > 0;
            provinceObj.isHide = !resLength;
            provinceObj.option = res || [];
            this.initItmeWidth({ type, resLength, formItme, shippingAddress });//处理输入框宽度
            if (resLength) {
                //判断输入的province是否有效
                let effective = {};
                res.forEach(item => {
                    if (item.code === province || item.name === province_name) {
                        effective = item
                    }
                });
                province = effective.code || '';
                formData.province_name = effective.name || '';
            }
            if (type === 'init' || type === 'country') {
                formData.province = province || (res[0] && res[0].code) || '';
                formData.province_name = formData.province_name || (res[0] && res[0].name) || '';
                let provinceItem = formItme.find(item => item.name === 'province') || {};
                let provinceItem2 = shippingAddress.find(item => item.name === 'province') || {};//给原始数据也赋值一下
                provinceItem.isHide = !resLength;
                provinceItem2.isHide = !resLength;
                provinceItem.option = res || [];
                provinceItem2.option = res || [];
                this.setState({ formData, formItme, shippingAddress }, () => {
                    if (type !== 'init') {
                        this.postageFun();
                    }
                });
            }
        }).catch(() => {
            formData.province = '';
            this.setState({ formData }, () => {
                if (type !== 'init') {
                    this.postageFun();
                }
            });
        })
    }
    initItmeWidth = ({ type, resLength, formItme, shippingAddress }) => {
        let arr = ['country', 'province', 'postal_code'];//需要调整的项
        if (type === 'init') {
            [...shippingAddress, ...formItme].forEach(item => {
                if (item.dynamic) {
                    if (arr.includes(item.name) && resLength) {
                        item.dynamic = 30;
                    } else {
                        item.dynamic = 50;
                    }
                }
            });
        } else if (type === 'country') {
            formItme.forEach(item => {
                if (item.dynamic) {
                    if (arr.includes(item.name) && resLength) {
                        item.dynamic = 30;
                    } else {
                        item.dynamic = 50;
                    }
                }
            });
        }
    }
    CountDown = () => {
        let { order = {} } = window.shopify_checkouts || {};
        let { expiredAt = 0 } = order || {};
        let { t } = this.props;
        if (!expiredAt) { return };
        this.viewTime && (this.viewTime.innerHTML = '<i>--</i> : <i>--</i>');
        this.timer = setInterval(() => {
            let minutes = Math.floor((expiredAt % 3600) / 60);
            minutes < 0 && (minutes = 0);
            let day = Math.floor((expiredAt / 3600) / 24);
            let hour = Math.floor((expiredAt / 3600) % 24);
            let seconds = Math.floor(expiredAt % 60) || '0';
            seconds < 10 && (seconds = `0${seconds}`);
            if (expiredAt > 0) {
                --expiredAt;
                minutes = (minutes < 10 ? `<i>0${minutes}</i>` : `<i>${minutes}</i>`);
                hour = (hour < 10 ? `<i>0${hour}</i>` : `<i>${hour}</i>`);
                let time = `${hour} : ${minutes} : <i>${seconds}</i>`;
                if (day) {
                    time = `<i>${day}D</i> ${time}`
                }
                this.viewTime && (this.viewTime.innerHTML = time);
            } else {
                clearInterval(this.timer);
                this.viewTime && (this.viewTime.innerHTML = '<i>00</i> : <i>00</i>');
                if (!this.state.subDisabled) {//倒计时结束后不可提交
                    this.setState({ subDisabled: true })
                };
            }
        }, 1000);
    }
    sinputChange = (type, val, selectedName) => {
        const { state } = this;
        let { formData } = state;
        let { shop = {} } = window.shopify_checkouts || {};
        let { platform_name } = shop;
        if (type) {
            formData[type] = val;
            this.setState({ formData });
            if ((type === 'country') && val != null) {
                formData.country_name = (selectedName || val);
                this.setState({ formData });
                this.getGatewayCountry('country', val);
                this.getProvinceOption(type, val);
            }
            if (type === 'first_name' || type === 'last_name') {//设置信用卡对应名字
                this.setCardholderName(formData);
            }
            if ((type === 'province') && val != null) {
                formData.province_name = (selectedName || val);
                if (platform_name === "SHOPIFY") {//只有SHOPIFY计算邮费需要省
                    this.postageFun();
                }

            }
            if (type === '__sl_checkout_shippingaddr__' && !val) {
                this.setAddress();
            }
        }
    }
    sinputChangetoPayment_gate_way = async (data, type = 'change') => {//Payment_gate_way变化的时候
        let { payGateWay, payMethod, payName } = data || {};
        const { order } = window.shopify_checkouts;
        const { currency } = order;
        const { t } = this.props;
        let { formData, gatewayList, beforSub = [] } = this.state;
        let { payment_gate_way, payment_method } = formData;
        payGateWay = (payGateWay || payment_gate_way);
        payMethod = (payMethod || payment_method);
        payName = (payName || formData.payName);
        const onGateWayItem = (gatewayList.find(item => item.payName === payName)) || {};
        formData.payment_method = onGateWayItem.payMethod;
        formData.payment_gate_way = onGateWayItem.payGateWay;
        formData.payName = onGateWayItem.payName;
        //如果当前货币不等于系统使用货币
        if (onGateWayItem.currency && (onGateWayItem.currency !== currency)) {
            //判断是否打开过转换货币的提示弹窗//modalVisible
            if (this.hasLocalStorageKey(`${OPENED_MODAL_KEY}${payName}`)) {
                this.setState({ formData });
            } else {
                this.saveLocalStorageKey(`${OPENED_MODAL_KEY}${payName}`);
                this.setState({ modalVisible: true, modalText: t('convertedUSD'), formData });
            }
        }
        if (beforSub.includes(payName)) {//Stripe-apple_pay等提前请求提交接口获取token
            this.beforeFun();
        }
        this.setState({ formData, paymentLoadError: false, onGateWayItem }, () => {//切换支付方式的时候恢复paymentLoadError
            this.onBlurUpdateOrder();
            if (formData.payName === 'PayPal-fast_pay_pal') {
                this.createPaypalButton()
            }
            this.initCpf();
        });
        trigger('CheckoutChannelChange', { channel: payment_gate_way, gateWay: formData.payment_method, type });
        gtmTrigger({ eventAction: 'payment_action',eventLabel: formData.payment_gate_way === 'credit' ? `method_${formData.payment_method}_credit` : `method_${formData.payment_gate_way}` });
    }
    //Stripe-apple_pay等提前请求提交接口获取token
    beforeFun = async () => {
        let { formData, gatewayList, subSuccessData } = this.state;
        let { payName } = formData;
        const submit = () => {
            if (sessionStorage.getItem('black_box')) {
                this.onsubmit('before');
            } else {
                getTongdun().then(black_box => {
                    this.setState({ black_box });
                    this.onsubmit('before');
                })
            }
        }
        if (payName === 'Stripe-apple_pay') {
            this.setState({ subLoading: true });
            const { publicKey } = gatewayList.find(item => item.payName === 'Stripe-apple_pay') || {};
            let isShowPay = await AppleGooglePay({ publicKey });
            //满足有publicKey且设备支持显示且没有请求成功过，才会预先请求
            if (isShowPay && !subSuccessData['Stripe-apple_pay']) {
                submit()
            } else { this.setState({ subLoading: false }) }
        };
    }
    setCardholderName = (formData) => {//设置信用卡对应名字
        this.refs.credit_card && this.refs.credit_card.setCardholder_name && this.refs.credit_card.setCardholder_name(formData)
    }

    onsubmitVerifyFun = (hideError = false, noVerifyArr) => {//专门用来验证参数,hideError:是否隐藏校验的错误提示
        let { formData, cpfItme, shippingAddress, isSimplify, shippingMethod } = this.state;
        const { special_zero } = formData;
        noVerifyArr = noVerifyArr || [];//不验证的项
        let addressOk = true, shippingOk = true;
        for (let key in formData) {
            if (!noVerifyArr.includes(key)) {
                let value = formData[key];
                //验证地址
                [...shippingAddress, ...cpfItme].forEach((item) => {//eslint-disable-line
                    item.isHide ? (item.error = false) : (item.name == key) && funverify({ value, verify: item.verify, item, scroll: true });//eslint-disable-line
                    if (item.error === true) {
                        addressOk = false;
                    }
                    (hideError && item.error === true) && (item.error = false);
                });
                //非0元购时候需要验证邮费
                if (!formData.special_zero) {
                    shippingMethod.forEach((item, index) => {//eslint-disable-line
                        item.isHide ? (item.error = false) : (item.name == key) && funverify({ value, verify: item.verify, item, scroll: true });//eslint-disable-line
                        if (item.error === true) {
                            shippingOk = false;
                        }
                        (hideError && item.error === true) && (item.error = false);
                    })
                }
            }
        };
        if (!shippingOk) {
            if (isSimplify) {
                this.setState({ formItme: shippingMethod });
            } else {
                this.setState({ formItme: [...shippingAddress, ...shippingMethod] });
            }
        }
        if (!addressOk) {//若收起来的情况下报错，就展开
            if (isSimplify) {
                this.handleSimplify();
            }
            this.setState({ formItme: special_zero ? shippingAddress : [...shippingAddress, ...shippingMethod] });
        }
        this.setState({ cpfItme });
        return addressOk && shippingOk
    }
    onclickSub = (finalData, type) => {
        let { payment_gate_way, payment_method } = finalData || {};
        const { onGateWayItem } = this.state;
        //监测提交订单上报
        let { order = {}, shop } = window.shopify_checkouts || {};
        let { items = [], discounts = [] } = order || {};
        let { name } = shop || {};
        let products = [];
        items?.length > 0 && items.forEach(item => {
            products.push({
                id: item.sku,//产品id
                name: item.title,//产品名称
                price: item.price,//产品价格
                variant: item.variant_title,//产品附加信息
                brand: name,//产品品牌
                quantity: item.quantity,//产品数量
                // category: $productCategory,//产品类别
            })
        })
        let options = {
            event: "eeEvent",
            eventAction: "add_payment_info",
            eventLabel: type || 'pay_now',
            // "coupon": "$coupon",//优惠码没有
            value: onGateWayItem?.payPrice,//最终价格
            "nonInteraction": false,
            ecommerce: {
                currencyCode: onGateWayItem?.currency || order.currency,
                checkout: {
                    actionField: {
                        step: 3,
                        option: payment_gate_way === 'credit' ? `${payment_method}_credit` : payment_gate_way,//这个变量没查到代表什么，回复说是支付方式
                        discount_amount: discounts || [],//优惠券
                    },
                    products
                }
            }
        }
        gtmTrigger(options);
    }
    subApplepay = () => {
        const { onGateWayItem = {} } = this.state;
        ApplePay.load(this.state, (applePayToken, response) => {
            this.defutsubmit({ applePayToken });
            ApplePay.response = response;
        });
    }
    onsubmit = async (btnType) => {//btnType:before提前执行，不会触发成功或者失败后的事
        let { order = {} } = window.shopify_checkouts || {};
        let { uuid = '' } = order;
        if (uuid) {
            const { pay_type, formData } = this.state;
            trigger('CheckoutSubmitClick', { channel: formData.payment_gate_way, gateWay: formData.payment_method });
            if (!this.onsubmitVerifyFun() || subFalg) {
                this.setState({ subLoading: false });
                return
            };
            if (formData.payName === 'Checkout-apple_pay') {
                this.subApplepay();
            } else {
                this.defutsubmit({}, btnType);
            }
        }
    }
    defutsubmit = async (extra = {}, btnType) => {//btnType:before提前执行，不会触发成功或者失败后的事件
        let { order = {}, shop = {} } = window.shopify_checkouts || {};
        let { language } = order;
        let { platform } = shop;
        const { formData } = this.state;
        this.setAddress();
        subFalg = true;
        this.setState({ subLoading: true });
        let finalData = {};
        finalData = Object.assign({}, formData, extra || {}, { platform, language });
        if (computShowDom('paymentMethod', this)) {//如果有paymentMethod， 才去拿paymentMethod的参数
            let cardData;//
            cardData = new Promise((resolve, reject) => {
                this.refs.credit_card && this.refs.credit_card.getCreditCardData((data) => {
                    resolve(data)
                    console.log('cardData', data);
                });
            })
            return Promise.all([cardData]).then((re = []) => {
                if (re && re[0]) {
                    finalData = Object.assign(finalData, re[0]);
                    this.post_checkout_deal(finalData, btnType);
                } else {
                    this.setState({ subLoading: false, visible: false });
                }
            }).catch(err => {
                this.setState({ subLoading: false, visible: false });
                console.log('finalData_catch', finalData, err);
                reportError("PAY NOW", err)
            }).finally(e => {
                subFalg = false;
            })
        } else {
            this.post_checkout_deal(finalData, btnType);
        }
    }
    post_checkout_deal = async (finalData, btnType) => {//最后提交
        let { beforSub = [], credits, pay_type, formData, subSuccessData, black_box, okText } = this.state;
        if (this.hasLocalStorageKey(SUCCESS_SUBMIT_KEY) && !(beforSub.includes(finalData.payName))) {
            subFalg = false;
            window.location.reload(true)
            return
        }
        black_box && (finalData.black_box = black_box);
        const shipping_rate_id = formData.shipping_rate_id.split('-')[0];
        const shipping_child_id = formData.shipping_rate_id.split('-')[1];
        finalData.shipping_rate_id = shipping_rate_id;
        finalData.shipping_child_id = shipping_child_id || '';
        if (credits.includes(finalData.payment_gate_way)) {
            finalData.payment_gate_way = 'credit'
        }
        /**
         * 排除不上传的参数begin
         */
        finalData.__sl_checkout_shippingaddr__ !== undefined && (delete finalData.__sl_checkout_shippingaddr__);
        /**
         * end
         */
        if (pay_type === 0 && btnType !== 'before') {
            this.AddPaymentInfo();
        }
        // return //demo
        this.setState({ sub_error_obj: {}, paymentAlert: '' });

        //上报点击 PayNow 事件
        if (btnType !== 'before') {//before的时候是切换到apple_pay的时候，不是用户点击的
            (new BzLogReporter()).sendPayNowEvent();
            if (btnType !== 'pay_pal') {//pay_pal已经pay_pal中上报了
                this.onclickSub(finalData);
            }
        }
        // console.log('finalData',finalData);
        // alert(`finalData：${JSON.stringify(finalData)}`);
        // alert(`apple_payFun调用前参数：${JSON.stringify(subSuccessData)}`);
        if (btnType !== 'before' && subSuccessData[finalData.payName]) {
            if (this[`${finalData.payment_gate_way}Fun`]) {//目前只有Apple Pay
                this[`${finalData.payment_gate_way}Fun`](finalData)
            }

            subFalg = false;
            return
        }

        checkout_deal(finalData).then(async (res = {}) => {
            if (btnType === 'before') {
                subSuccessData[finalData.payName] = res;
                this.setState({ subSuccessData, subLoading: false, visible: false });
                return
            } else {
                if (finalData.payment_method === 'AfterPay') {
                    this.AfterPayFun(res, finalData);
                } else {
                    this.subSuccessFun(res, finalData);
                    if (finalData.payName === 'Checkout-apple_pay') {
                        ApplePay.response && ApplePay.response('success');
                    }
                }
            }

        }).catch((err) => {
            let { message = '', message_key = '', status } = err;
            gtmTrigger({ eventAction: 'payment_action', eventLabel: 'pay_fail' });
            let paymentAlert = message;
            if (CPF_ERROR_CODE.includes(message_key)) {
                paymentAlert = '';
                this.cpfErrorSet(err);
            }
            if (message_key === 'refresh_data') {//分期不存在的时候
                this.getGatewayCountry('update');
            }
            if (finalData.payment_method === 'Checkout' && message_key === 'change_pacypay_tip') {//切换支付方式
                paymentAlert = '';
                this.change_pacypay_tip();
            }
            if (message_key === 'token_expire') {//Checkout绑卡支付时候token过期提醒，
                okText = this.props.t('CONTINUE');
            }
            this.setState({ okText, sub_error_obj: err || {}, paymentAlert, subLoading: false, subDisabled: btnType === 'before', visible: false });
            if (!status) {
                reportError("post_checkout_deal", err)
            };
            if (finalData.payName === 'Checkout-apple_pay') {
                ApplePay.response && ApplePay.response();
            }
        }).finally(e => {
            subFalg = false;
        })
    };
    subSuccessFun = (res, finalData = {}) => {//成功后的执行操作,finalData提交时候的数据
        let { order = {} } = window.shopify_checkouts || {};
        let { uuid = '' } = order;
        const { pay_type } = this.state;
        let { url, urlType, can_click_back = false } = res || {};
        url = url || '';
        trigger('CheckoutSubmitSuccess', { channel: finalData.payment_gate_way, gateWay: finalData.payment_method });
        const can_back = (can_click_back || url.includes('paypal.com'));
        if (can_click_back && url) {
            //如果是可以返回的url，就记录一下该url
            window.sessionStorage.setItem(CAN_CLICK_BACK, uuid);
            //这里暂存用户选中的支付方式，避免用户使用浏览器返回的时候shopify_checkouts对象没有被及时更新
            window.sessionStorage.setItem('payment_gate_way', finalData.payment_gate_way);
            window.sessionStorage.setItem('payment_method', finalData.payment_method);
        }
        if (urlType === 'approve') {//非成功
            if (can_back) {//如果是paypal就不用替换的跳转，让他可以返回
                window.location.href = (url || '/');
            } else {
                window.location.replace(url || '/');
            }
            setTimeout(() => {//location.href无法马上跳转，延迟3秒后恢复状态
                this.setState({ subLoading: false });
            }, 3000);
        } else {//成功
            this.saveLocalStorageKey(SUCCESS_SUBMIT_KEY);
            setTimeout(() => {
                if (can_back) {//如果是paypal就不用替换的跳转，让他可以返回
                    window.location.href = (url || '/');
                } else {
                    window.location.replace(url || '/');
                }
                setTimeout(() => {//location.href无法马上跳转，延迟3秒后恢复状态
                    this.setState({ subLoading: false });
                    subFalg = false;
                }, 3000);
            }, 1000);
        }
    }
    apple_payFun = async (finalData) => {
        let { gatewayList = [], subSuccessData } = this.state
        let { client_data = {} } = subSuccessData['Stripe-apple_pay'] || {};
        let { client_secret } = client_data || {};
        let { publicKey } = gatewayList.find(item => item.payName === 'Stripe-apple_pay') || {};
        let { paymentRequest, stripe, appData } = await AppleGooglePay({ publicKey });
        if (appData) {//是app
            // 调用stripe apple pay
            this.setState({ subLoading: false, visible: false });
            console.log('传递给payNowApplePayAction参数：', { public_key: publicKey, client_secret, ...appData });
            trigger('CheckoutPayNowApplePayAction');
            payNowApplePayAction({ public_key: publicKey, client_secret, ...appData }, (res) => {
                console.log('payNowApplePayAction响应参数：', res);
                let { setup } = res || {};//setup:success/fail/userCancel/userOk
                trigger('CheckoutPayNowApplePayActionCallback', { status: setup });
                if (setup === 'success') {//调起成功
                    applePayCallbackAction((re) => {
                        let { status } = re || {};//setup:success/fail/userCancel/userOk
                        trigger('CheckoutApplePayCallbackActionCallback', { status });
                        console.log('applePayCallbackAction响应参数：', re);
                        if (status === 'success') {//支付成功
                            this.subSuccessFun(subSuccessData['Stripe-apple_pay']);
                        } else {
                            this.setState({ subLoading: false, visible: false });
                        }
                    })
                } else if (setup === 'fail') {//流程出错
                    subSuccessData['Stripe-apple_pay'] = null;
                    this.setState({ subSuccessData });
                    Pubsub.publish('setPaymentLoadError', { type: 'Stripe-apple_pay' });
                }
            });
        } else {
            paymentRequest.show();
            trigger('CheckoutPaymentRequestShow');
            this.setState({ subLoading: false, visible: false });
            paymentRequest.on('paymentmethod', async (ev) => {
                trigger('CheckoutPaymentmethod');
                // $('#test1').text(`ev：${JSON.stringify(ev)}`);
                const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
                    client_secret,
                    { payment_method: ev.paymentMethod.id },
                    { handleActions: false }
                );
                // $('#test2').text(`paymentIntent：${JSON.stringify(paymentIntent)}`);
                // $('#test3').text(`confirmError：${JSON.stringify(confirmError)}`);
                if (confirmError) {
                    trigger('CheckoutPaymentmethodOver', { status: 'fail' });
                    ev.complete('fail');
                    // alert(`error：${JSON.stringify(confirmError)}`);
                    // alert(`paymentIntent：${JSON.stringify(paymentIntent)}`);
                } else {
                    trigger('CheckoutPaymentmethodOver', { status: 'success' });
                    ev.complete('success');
                    // alert(`subSuccessData：${JSON.stringify(subSuccessData)}`);
                    if (paymentIntent.status === "requires_action") {
                        trigger('CheckoutPaymentmethodRequiresAction');
                        // Let Stripe.js handle the rest of the payment flow.
                        const { error } = await stripe.confirmCardPayment(client_secret);
                        if (error) {
                            trigger('CheckoutPaymentmethodRequiresAction', { status: 'fail' });
                            // The payment failed -- ask your customer for a new payment method.
                        } else {
                            trigger('CheckoutPaymentmethodRequiresAction', { status: 'success' });
                            this.subSuccessFun(subSuccessData['Stripe-apple_pay'], finalData);
                            // The payment has succeeded.
                        }
                    } else {
                        this.subSuccessFun(subSuccessData['Stripe-apple_pay'], finalData);
                        // The payment has succeeded.
                    }
                }
            })
        }
    }
    AfterPayFun = (res, finalData) => {
        let { client_data = {} } = res || {};
        const { client_secret } = client_data || {};
        if (client_secret && window.AfterPay) {
            const { order = {} } = window.shopify_checkouts || {};
            const { address } = order || {};
            const { country: countryCode } = address || {};
            AfterPay.initialize({ countryCode });
            // To avoid triggering browser anti-popup rules, the AfterPay.open()
            // function must be directly called inside the click event listener
            AfterPay.open();
            // If you don't already have a checkout token at this point, you can
            // AJAX to your backend to retrieve one here. The spinning animation
            // will continue until `AfterPay.transfer` is called.
            // If you fail to get a token you can call AfterPay.close()
            AfterPay.onComplete = (event) => {
                console.log('event', event);
                const { status } = event.data || {};
                if (status === "SUCCESS") {
                    this.subSuccessFun(res, finalData)
                    // The consumer confirmed the payment schedule.
                    // The token is now ready to be captured from your server backend.
                } else {
                    this.setState({ subLoading: false, visible: false });
                    // The consumer cancelled the payment or closed the popup window.
                }
            }
            // AfterPay.redirect({token: client_secret});
            AfterPay.transfer({ token: client_secret });
        } else {
            this.setState({ subLoading: false, visible: false });
        }
    }
    /**
     * 切换支付方式
     */
    change_pacypay_tip = (type = 'PacyPay') => {
        let { t } = this.props;
        let { formData, gatewayList, modalText } = this.state;
        formData.payment_method = type;
        if (gatewayList && gatewayList.length) {
            ((gatewayList.find(item => item.payGateWay === 'credit') || {}).payMethod) = type;
        };
        modalText = t('paymentMethod.change_pacypay');
        this.setState({ gatewayList, formData, modalVisible: true, modalText });
    }
    /**
     * 保存地址
     */
    setAddress = () => {
        const { formData = {}, isSimplify, pay_type } = this.state;
        if (isSimplify || pay_type === 1) { return }//如果是快捷支付时候的地址  不保存到本地
        const { email = '', subscribe = false, first_name = '', last_name = '', address1 = '', address2 = '', city = '', country = '', province = '', province_name = '', postal_code = '', phone = '', country_name, __sl_checkout_shippingaddr__ = false } = formData;
        if (__sl_checkout_shippingaddr__ && country && phone) {
            let obj = { email, subscribe, first_name, last_name, address1, address2, city, country, province, province_name, postal_code, phone, country_name, __sl_checkout_shippingaddr__ };
            localStorage.setItem('__sl_checkout_shippingaddr__', JSON.stringify(obj));
        } else {
            localStorage.removeItem('__sl_checkout_shippingaddr__');
        }
    }

    AddPaymentInfo = () => {
        try {
            const { onGateWayItem } = this.state;
            let { order = {} } = window.shopify_checkouts || {};
            let { items = [] } = order || {};
            let content_ids = [];
            items.length > 0 && items.forEach(item => {
                content_ids.push(item.sku);
            });
            // content_ids=content_ids.toString();
            let obj = { content_type: 'product_group', content_ids, value: onGateWayItem?.payPrice, currency: onGateWayItem?.currency }
            window.fbq && window.fbq('track', 'AddPaymentInfo', obj);
        } catch (e) {
            reportError("AddPaymentInfo", e)
            console.log('AddPaymentInfo error', e);
        }
    }

    // sendFacebookOtherEvents = () => {
    //     let { order = {} } = window.shopify_checkouts || {};
    //     let { uuid = '' } = order;
    //     if (!sessionStorage.getItem(uuid)) {
    //         sessionStorage.setItem(uuid, 1);
    //         if (typeof (window.fbq) === 'function') {
    //             window.fbq('trackCustom', 'OnePageCheckoutView');
    //             this.InitiateCheckout()
    //         }
    //     }
    // }
    // InitiateCheckout = () => {
    //     let { order = {} } = window.shopify_checkouts || {};
    //     let { items = [], currency, total_price } = order || {};
    //     let content_ids = [];
    //     let num_items = items.length || 0;
    //     num_items > 0 && items.forEach(item => {
    //         content_ids.push(item.sku);
    //     });
    //     // content_ids=content_ids.toString();
    //     let obj = { content_type: 'product_group', content_ids, value: total_price, num_items, currency }
    //     window.fbq && window.fbq('track', 'InitiateCheckout', obj);
    // }

    //利用uuid作为值，判断是否成功保存过某key
    hasLocalStorageKey = (key) => {
        let { order = {} } = window.shopify_checkouts || {};
        let { uuid = '' } = order;
        let old_uuid = window.localStorage.getItem(key);
        if (old_uuid && old_uuid === uuid) {
            return true;
        } else {
            return false;
        }
    }
    //利用uuid作为值，保存某key
    saveLocalStorageKey = (key) => {
        let { order = {} } = window.shopify_checkouts || {};
        let { uuid = '' } = order;
        if (uuid && key) {
            window.localStorage.setItem(key, uuid);
        }
    }
    onBlurUpdateOrder = (type = '', val) => {//保存用户信息
        const { formData, formItme, credits, onGateWayItem } = this.state;
        if (type && val && formData[type]) { formData[type] = val };
        let { shipping_rate_id = '', email, payment_gate_way } = formData;
        if (!email) { return };
        let isError = ((formItme.find(it => it.name === type) || {}).error) || false;
        let emailError = ((formItme.find(it => it.name === 'email') || {}).error) || false;
        if (isError || emailError) { return };
        let exclude = [];//排除项
        let obj = Object.assign({}, formData);
        obj.payment_method = onGateWayItem?.payMethod;
        if (credits.includes(obj.payment_gate_way)) {
            obj.payment_gate_way = 'credit';
        }
        obj.shipping_rate_id = shipping_rate_id.split('-')[0];
        obj.shipping_child_id = shipping_rate_id.split('-')[1];
        exclude.length > 0 && exclude.forEach(item => {
            delete obj[item];
        });
        update_draft_order(obj)
    }

    promiseAll = () => {
        let { country } = this.state.formData;
        this.setState({ shippingMethodLoading: true });
        if (country) {//如果有country就不等getCountryOption了
            Promise.all([]).then(res => {
                this.postageFun(true)
            }).finally(e => {
                this.setState({ shippingMethodLoading: false });
            });
            this.getCountryOption()
        } else {
            Promise.all([this.getCountryOption()]).then(res => {
                this.postageFun(true)
            }).finally(e => {
                this.setState({ shippingMethodLoading: false });
            });
        }
        let { order } = window.shopify_checkouts || {};
        let { special_zero } = order || {};
        if (special_zero) {//初始化的时候，如果是0元 就修改对应的显示隐藏
            this.showOrderBack({ special_zero });
        }
    }
    postageFun = async (noInit) => {//邮费计算,noInit 是否清空shipping_rate_id，默认是清空的
        let { order = {}, shop = {} } = window.shopify_checkouts || {};
        let { platform_name } = shop;
        const { no_shipping_price = 0 } = order;
        let { shipping_zones = [], formData = {}, shipping_method_list = [] } = this.state;
        let { country, province } = formData;
        if (!country) { return }
        !noInit && (formData.shipping_rate_id = '');
        if (!shipping_method_list || shipping_method_list.length === 0) {
            await this.get_harbor_shipping_method();
        }
        //这里检查一下邮费id是否有效，若无效就清空
        let list = this.state.shipping_method_list || [];
        let obj = list.find(item => item.shipping_rate_id === formData.shipping_rate_id);
        if (!obj) {
            formData.shipping_rate_id = '';
        }
        this.setState({ formData })
    }
    getPostageData = (type) => {
        const { shipping_method_list = [], formData } = this.state;
        if (formData.shipping_rate_id) {
            let item = (shipping_method_list.find(it => it.shipping_rate_id === formData.shipping_rate_id) || {});
            if (item) {
                if (item[type] && item[type] === 0) {//如果是number类型 就显示0.00
                    return '0.00';
                } else {
                    return item[type]
                }
            } else {
                return item
            }
        } else {
            return {}
        }
    }
    handleSimplify = (e) => {//点击change
        const { shippingAddress = [], shippingMethod = [], formData } = this.state;
        const { country, province, special_zero } = formData;
        this.setState({ isSimplify: false, formItme: special_zero ? shippingAddress : [...shippingAddress, ...shippingMethod] }, () => {
            //此UI暂时不需要
            // this.getProvinceOption('init', country);//change后才有必要请求province list
            // let emailDom = document.getElementById('email');
            // emailDom && emailDom.focus();
        })
    }
    beforReturnLink = () => {
        const { gatewayList = [] } = this.state;
        gtmTrigger({ eventAction: 'payment_action',eventLabel: "back_button" });
        if (gatewayList && gatewayList.length) {//有列表才能继续
            Pubsub.publish('setFeedbackVisible', { trigger: 1 });
        } else {
            this.returnLink()
        }
    }

    returnLink = (e) => {
        let evt = e || window.event; //获取event对象
        let { t } = this.props
        let { shop = {}, order = {} } = window.shopify_checkouts || {};
        let { domain = '', mobile_url = '' } = shop;
        let { language = '' } = order;
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
        if (mobile_url) {
            if (language) {
                if (mobile_url.includes("&")) {
                    window.location.replace(`${mobile_url}${getChgLanguageParams(language.toLowerCase(), "&")}`);
                } else {
                    window.location.replace(`${mobile_url}${getChgLanguageParams(language.toLowerCase(), "?")}`);
                }
            } else {
                window.location.replace(mobile_url)
            }
        } else {
            history.go(-1);
            location.hash = '';
        }
    }
    showOrderBack = (res) => {//优惠券成功后的返回,目前用于判断是否免邮
        let { isOk, amount = 0, special_zero } = res || {};
        let { pay_type, isSimplify, shippingMethod, shippingAddress } = this.state || {};
        let { formData } = this.state;
        if (special_zero) {
            formData.special_zero = true;
            if (isSimplify) {
                this.setState({ formData, formItme: [] });
            } else {
                this.setState({ formData, formItme: shippingAddress });
            }
        } else {
            formData.special_zero = false;
            if (isSimplify) {
                this.setState({ formData, formItme: shippingMethod });
            } else {
                this.setState({ formData, formItme: [...shippingAddress, ...shippingMethod], simplifyList: [] });
            };
        }
    }
    render_gate_way = () => {
        const { t } = this.props;
        const { gatewayList } = this.state;
        return <Cards isMobile={isMobile} style={{ borderRadius: 0 }} theme='appTheme' t={t} parentState={this.state} ref='credit_card' payChange={this.sinputChangetoPayment_gate_way} onChange={this.sinputChange} cards={gatewayList} currentLng={this.currentLng} />
    }

    initAddress1 = () => {
        let { formData } = this.state;
        const { shop = {} } = window.shopify_checkouts || {};
        return ShippingFormatedAddress(formData, shop)
        // let { formData } = this.state;
        // const { postal_code = '' } = formData || {};
        // let items = ['address2', 'address1', 'city', 'province_name', 'country'];
        // let shipTo = [];
        // items.forEach(item => {
        //     formData[item] && shipTo.push(` ${formData[item]}`);
        // });
        // return `${postal_code} ${shipTo.toString() || ''}`;
    }
    changeModalVisible = () => {
        this.setState({ modalVisible: false });
    }
    clearAlert = () => {
        this.setState({ paymentAlert: '', okText: null })
    }
    handleTest = (e) => {
        console.log('e', e.target.value);
        this.setState({ test: e.target.value })
    }
    initInstallment = () => {//分期信息
        const { t } = this.props;
        let { instalmentsItem } = this.state
        let { periodNumber, periodAmount, customerInterestRate } = instalmentsItem
        return `${currencySequence(periodAmount || 0)}/${t('paymentMethod.creditCard.Month')} (${periodNumber}x @ ${customerInterestRate}%)`
    }
    paypalLaterUI = () => {
        let { order = {}, shop = {} } = window.shopify_checkouts || {};
        let { all_price = 0 } = order;
        const { default_country = "" } = shop;
        const { formData } = this.state;
        const { country } = formData || {};
        return !isMobile && default_country === "US" && country === "US" && all_price > 0 && <div className={styles.paypalLater}>
            <div
                data-pp-message
                data-pp-buyercountry="US"
                data-pp-style-layout="text"
                data-pp-style-logo-type="inline"
                data-pp-style-text-color="black"
                data-pp-style-logo-position="top"
                data-pp-amount={all_price}>
            </div>
            <div className={styles.paypalLaterExplain}>If <i>Pay Later</i> button available, You can click it to apply  pay in 4 interest-free.</div>
        </div>

    }
    render() {
        const { t } = this.props;
        const { credits, okText, gatewayList = [], paymentLoadError = false, instalmentsItem, modalVisible, modalText, onGateWayItem, sub_error_obj = {}, cpfItme, subDisabled, shipping_not_change, paymentAlert, gatewayCountryLoading = false, pay_type = 0, formItme, formData, visible, shipping_method_list = [], subLoading, simplifyList = [], isSimplify = false, shippingMethodLoading = false } = this.state;
        const { display_type } = sub_error_obj || {};
        const { payment_gate_way = '', payment_method, postal_code = '', address2, special_zero } = formData || {};// eslint-disable-line
        let { order = {}, shop = {} } = window.shopify_checkouts || {};
        let { expiredAt, total_price = 0, discounts, extras = [], orderNumber, items_subtotal_price } = order || {};
        let { font_family = '', platform_name } = shop;//pay_pal_is_active是否显示pay_pal支付默认true
        let isCredit = credits.includes(payment_gate_way);
        const onlinePaymentDiscount = (onGateWayItem?.discount?.discountAmount) || 0;
        let all_price = Number.prototype.precision((onGateWayItem?.payPrice * 1) || 0);
        // let all_price = Number.prototype.precision(on_price + newInterest);//现在全部取后端算的结果
        all_price < 0 && (all_price = 0);
        if (window.shopify_checkouts && window.shopify_checkouts.order) {
            window.shopify_checkouts.order.all_price = all_price;
            window.shopify_checkouts.order.user_discounts = [];
            onlinePaymentDiscount && (window.shopify_checkouts.order.user_discounts.push({ title: t('paymentMethod.YourBill.OnlinePayDis'), price: onlinePaymentDiscount }));
            this.getPostageData('price') && (window.shopify_checkouts.order.user_discounts.push({ title: t('paymentMethod.YourBill.ShippingCost'), price: this.getPostageData('price') || '' }));
        }
        let viewPrice = currencySequence(all_price, onGateWayItem?.currency || order.currency)//价格的显示
        let isApplePay = payment_gate_way === 'apple_pay';
        let subBtnText = isMobile ? (isApplePay ? <span><Sicon className={styles.app_btn_icon} icon='appBtn' />{`(${viewPrice})`}</span> : <span>{`${t('payNow')} (${viewPrice})`}</span>) : (isApplePay ? <span><Sicon className={styles.app_btn_icon} icon='appBtn' /></span> : <span>{t('payNow')}</span>);
        let renderBtn = () => {
            let is_fast_pay_pal = (payment_gate_way === 'fast_pay_pal') && all_price !== 0;
            return computShowDom('subBtn', this) && <><div style={{ display: is_fast_pay_pal ? 'block' : 'none' }}><div className={classNames(styles.btn, styles.fastBtn)} id='paypal-button-container'></div>{this.paypalLaterUI()}</div>
                <Sbutton style={{ display: is_fast_pay_pal ? 'none' : 'block' }} id="payNow" className={classNames(styles.btn, styles.sbutton)} type='primary' onClick={this.onsubmit.bind(this)} loading={subLoading} disabled={subDisabled || gatewayCountryLoading || paymentLoadError}>{subBtnText}</Sbutton></>
        }
        let disList = () => {
            //优惠信息列表，显示list表的
            if (discounts && discounts.length) {
                return discounts.map((item, index) => {
                    return <div key={index} className={classNames(styles.subtotal)}>
                        <span>{item.title}</span>
                        <span className={styles.red_proce}>-{currencySequence(item.price)}</span>
                    </div>
                })
            } else {
                return null
            }
        }
        let chargeList = () => {
            //优惠信息列表，显示list表的
            if (extras && extras.length) {
                return extras.map((item, index) => {
                    return <div key={index} className={classNames(styles.subtotal)}>
                        <span>{t(item.methodName || '') || '-'}</span>
                        <span>{currencySequence(item.price)}</span>
                    </div>
                })
            } else {
                return null
            }
        }
        let countDownDom = '';
        // let countDownDom = expiredAt ? <div className={styles.countDown}>
        //     {t('timeRemaining')} &nbsp; <span ref={e => this.viewTime = e}></span>
        // </div> : '';
        let cpfDom = () => {
            return cpfItme.map((item, index) => {
                if (item.type === 'input' && !item.isHide) {
                    return <div key={index} className={styles.rightItem}>
                        <div className={styles.itemTitle}>{item.placeholder}</div>
                        <Sinput theme='appTheme' type={item.types} id={item.name} onBlur={this.onBlurUpdateOrder.bind(this, item.name)} className={styles.cpfinput} value={formData[item.name]} verify={item.verify} item={item} onChange={this.sinputChange.bind(this, item.name)} maxLength={item.maxLength} />
                    </div>
                } else {
                    return null
                }
            })
        };

        let discountsList = () => {
            return <>
                <div className={styles.rightItem}>
                    <div className={styles.itemTitle}>{t('shippingAddress.label')}</div>
                    <div className={styles.itemText}>{this.initAddress1()}</div>
                </div>
                {cpfDom()}
                <div className={styles.rightItem} style={{ borderBottom: 'none' }}>
                    <div className={classNames(styles.subtotal)}>
                        <span>{t('paymentMethod.YourBill.ProductsTotal')}</span>
                        <span className={styles.text}>{currencySequence(items_subtotal_price)}</span>
                    </div>
                    {!!onlinePaymentDiscount && <div className={classNames(styles.subtotal)}>
                        <span>{t('paymentMethod.YourBill.OnlinePayDis')}</span>
                        <span className={styles.red_proce}>-{currencySequence(onlinePaymentDiscount)}</span>
                    </div>}
                    {disList()}
                    <div className={classNames(styles.subtotal)}>
                        <span>{t('paymentMethod.YourBill.ShippingCost')}</span>
                        <span className={styles.text}>{currencySequence(this.getPostageData('price') || '')}</span>
                    </div>
                    {chargeList()}
                    {isCredit && instalmentsItem && <div className={classNames(styles.subtotal)}>
                        <span>{t('paymentMethod.YourBill.AdCharge')}</span>
                        <span className={styles.text}>{currencySequence(instalmentsItem.interest || 0)}</span>
                    </div>}
                    <div className={styles.total}>
                        <div className={styles.title}><span>{t('calculate.total')}</span> {this.isMIDDLE && <span className={styles.pcVat}>({t('VATIncluded')})</span>}</div>
                        <span className={styles.text}>{viewPrice}</span>
                    </div>
                    {isCredit && instalmentsItem && <div className={classNames(styles.subtotal, styles.installment)}>
                        <span>{t('paymentMethod.YourBill.MoInstallment')}</span>
                        <span className={styles.text}>{this.initInstallment()}</span>
                    </div>}
                </div>
            </>
        }
        const mobileDom = () => {
            return <div className={styles.mo_app} id='mo_app'>
                {!IS_APP && <div className={styles.back}><Sback SmodalCancel={this.returnLink} onClick={this.beforReturnLink} /></div>}
                <div className={styles.mo_alert} style={IS_APP ? {} : { top: '3.063rem' }}><Salert okText={okText} viewClose={true} theme={display_type === 1 ? 'modal' : 'mobile'} className={styles.Salert} type='error' value={paymentAlert} onOk={this.clearAlert} /></div>
                {gatewayCountryLoading ? <Skeleton isMobile={true} /> : (gatewayList && gatewayList.length > 0 ? <div>
                    <div className={styles.mo_main} ref={e => this.mo_main = e} style={IS_APP ? {} : { paddingTop: '4.063rem' }}>
                        <div className={styles.payment}>
                            {/* {gatewayCountryLoading ? <div className={styles.isloading}><i className='s-icon-loading' /></div> : <div>
						{computShowDom('paymentMethod', this) && this.render_gate_way(payment_gate_way)}
					</div>} */}
                            {this.render_gate_way()}
                            {/* {computShowDom('paymentMethod', this) && this.render_gate_way(payment_gate_way)} */}
                        </div>
                        <div className={styles.feedback}><Feedback formData={formData} callback={this.returnLink} /></div>
                        <div className={styles.bill}>
                            {discountsList()}
                        </div>
                        <div className={styles.wrap}>
                            <RenderCardImg icon={'pcis'} />
                            <p>{t('paymentMethod.completelyAndSecure')}</p>
                        </div>
                    </div>
                    <div className={styles.payNow} ref={e => this.payNow = e} style={IS_APP ? { paddingBottom: 25 } : {}}>
                        {countDownDom}
                        {renderBtn()}
                    </div>
                </div> : <NoPayment />)}
            </div>
        };
        const pcDom = () => {
            return <div className={styles.app}>
                <div className={styles.headerTopBox}><HeaderTop /></div>
                <div className={styles.topBox}>
                    <Header SmodalCancel={this.returnLink} parentState={this.state} callback={this.beforReturnLink} />
                </div>
                {gatewayCountryLoading ? <Skeleton /> : (gatewayList && gatewayList.length > 0 ? <div className={styles.main}>
                    <div className={styles.left}>
                        <div className={styles.title}>{t('paymentMethod.label')}</div>
                        <div style={paymentAlert ? { margin: '0px 1.25rem', borderBottom: '1px solid #eee' } : {}}><Salert okText={okText} theme={display_type === 1 ? 'modal' : ''} className={styles.Salert} type='error' value={paymentAlert} onOk={this.clearAlert} /></div>
                        {this.render_gate_way()}
                        {/* {computShowDom('paymentMethod', this) && this.render_gate_way(payment_gate_way)} */}
                    </div>
                    <div className={styles.right}>
                        <div className={styles.rightTop}>
                            <div className={classNames(styles.rightItem, styles.titleRightItem)}>
                                <div className={styles.title}>{t('paymentMethod.YourBill.label')}:</div>
                            </div>
                            <div className={styles.rightItem}>
                                <div className={styles.itemTitle}>{t('paymentMethod.YourBill.OrderNumber')}</div>
                                <div className={styles.itemText}>{orderNumber}</div>
                            </div>
                            {discountsList()}
                            <div className={styles.rightItem}>
                                <div className={styles.payNow}>
                                    {countDownDom}
                                    {renderBtn()}
                                    <div className={styles.feedback}><Feedback formData={formData} callback={this.returnLink} /></div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.wrap}>
                            <RenderCardImg icon={'pcis'} />
                            <p>{t('paymentMethod.completelyAndSecure')}</p>
                        </div>
                    </div>
                </div> : <NoPayment />)}
            </div>
        }
        let isRtl = !!(this.currentLng === 'ar');
        return (
            // <div><Skeleton/></div>
            <div className={classNames(styles.box, isRtl ? styles._rtl : '')} style={font_family ? { fontFamily: font_family } : null}>
                {isMobile ? mobileDom() : pcDom()}
                <Sloading visible={visible} t={t} />
                <Smodal visible={modalVisible} onOk={this.changeModalVisible}>{modalText}</Smodal>
            </div>
        );
    }
}

export default (withTranslation()(Index));
