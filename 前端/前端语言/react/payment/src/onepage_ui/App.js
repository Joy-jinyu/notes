import React, { Component } from "react";

import { withTranslation } from "react-i18next";
import { get, post } from '@/http'
import styles from './App.module.scss';
import { Smodal, Scheckbox, Sinput, Feedback, Sselect, Sbutton, Sloading, Slist, Salert, Stips } from '../compoents';
import { Cards, ShowOrder, AddressSelection, ChooseUs, RenderCardImg, Logo, BillingAddress, CardBox, EbanxMexico, EbanxChile, EbanxPeru, Checkout, Pacypay } from "../compoents/apps"
import classNames from 'classnames';
// import 'rc-dialog/assets/index.css';
// import testArr from "./compoents/apps/shipping-zone"

import { get_click_back, checkout_deal, get_all_country, get_all_province, get_shipping_zones, harbor_shipping_method, get_group_gateway_country, get_paypal_shipping_info, update_draft_order, refresh_inventory, page_loaded } from "../api/api"
import { InitMessage, scrollToId, getTongdun, CPF_ERROR_CODE, cpfObj, funverify, rule, computShowDom, listenerGoogleKeyError, currencySymbol, init_on_payment_method, querySelector } from "../utils"

// const isDev = (process.env.NODE_ENV === 'development');
import { update_ui_version } from "../api/api"
import { reportError } from "../utils/logger"
import Pubsub from "../utils/pubsub"

let __sl_checkout_shippingaddr__ = JSON.parse(localStorage.getItem('__sl_checkout_shippingaddr__') || '{}');
let HAS_SHIPINGADDR = (__sl_checkout_shippingaddr__.email ? true : false);
const CAN_CLICK_BACK = '__can_click_back';//用于记录允许返回到收银台的订单,重新返回到收银台时删除记录
class Index extends Component {
    constructor({ t, i18n }) {
        super();
        this.state = {
            shippingAddress: [//原始form数据
                { name: t('contactInfo.label'), type: 'title' },
                { name: 'email', type: 'input', types: 'email', placeholder: t('contactInfo.emailOrPhone'), verify: [{ required: true }, { pattern: rule.email, message: 'error email' }] },
                { name: 'subscribe', type: 'checkbox', placeholder: t('contactInfo.keepMeUpto') },
                { name: t('shippingAddress.label'), type: 'title' },
                { name: 'first_name', type: 'input', placeholder: t('shippingAddress.firstName'), dynamic: 50, verify: [{ required: true }] },
                { name: 'last_name', type: 'input', placeholder: t('shippingAddress.lastName'), dynamic: 50, verify: [{ required: true }] },
                { name: 'address1', type: 'input', placeholder: t('shippingAddress.address'), verify: [{ required: true }] },
                { name: 'address2', type: 'input', placeholder: t('shippingAddress.apartment') },
                { name: 'city', type: 'input', placeholder: t('shippingAddress.city'), verify: [{ required: true }] },
                {
                    name: 'country', type: 'select', placeholder: t('shippingAddress.countryRegion'), dynamic: 50, option: [], verify: [{ required: true }]
                },
                { name: 'province', type: 'select', placeholder: t('shippingAddress.province'), dynamic: 50, option: [], isHide: true, verify: [{ required: true }] },
                { name: 'postal_code', type: 'input', placeholder: t('shippingAddress.postalCode'), dynamic: 50, verify: [{ required: true }] },
                { name: 'phone', type: 'input', types: 'tel', placeholder: t('shippingAddress.phone'), verify: [{ required: true }, { pattern: rule.phone, message: 'error phone' }] },
                { name: 'cpf', type: 'input', isHide: true, maxLength: 12, verify: [{ required: true }] },
                { name: '__sl_checkout_shippingaddr__', type: 'checkbox', placeholder: t('saveInformation') },

            ],
            shippingMethod: [//原始form数据
                { name: t('shippingMethod.label'), type: 'title' },
                { name: 'shipping_rate_id', type: 'addressSelection', placeholder: 'address selection', verify: [{ required: true }] },
            ],
            formItme: [],//实际使用的form
            formData: { cpf: '', special_zero: false, shipping_rate_id: '', shipping_child_id: '', email: '', subscribe: true, first_name: '', last_name: '', address1: '', address2: '', city: '', country: '', province: '', province_name: '', postal_code: '', phone: '', __sl_checkout_shippingaddr__: false, payment_method: '', payment_gate_way: '' },
            visible: false,
            shipping_zones: [],
            subLoading: false,
            // payment_gate_way: 'pacpay_credit',//pacpay_credit、Ebanx_credit、worldpay_credit、adyen_credit、checkout_credit
            gatewayList: [
                // { payMethod: "Checkout", payGateWay: "credit", publicKey: "pk_test_61801af3-d323-44f9-a42a-82669df3bdcb" },
                // { payMethod: "PacyPay", payGateWay: "credit", publicKey: "" },
                // // { payMethod: "PayPal", payGateWay: "fast_pay_pal", publicKey: "" },
                // // { payMethod: "Ebanx", payGateWay: "oxxo", publicKey: "" },
                // { payMethod: "PayPal", payGateWay: "pay_pal_credit", publicKey: "" },
            ],
            originKeys: {},//get_gateway_country请求返回的所有参数，主要使用其中各种key，adyen、checkout……
            simplifyList: [],
            isSimplify: false,//是否显示简化地址
            // country_name: '',//需要保存于localstorage的数据.现在合并到__sl_checkout_shippingaddr__里了
            shippingMethodLoading: false,//邮费接口是否在加载中
            pay_type: 0,//标识用户是那种支付，1:快捷支付，0是非快捷支付
            gatewayCountryLoading: false,
            countryOption: [],//国家列表
            page: 0,//页面标记
            paymentAlert: '',
            sub_error_obj: {},
            shipping_method_list: [],//地址备选项
            noStock: false,//是否有0库存宝贝
            shipping_not_change: false,//不能更改邮费，默认可以更改
            // special_zero:false,//是否是0元购,放到formData里去了
            modalVisible: false,//modal是否显示
            modalText: '',//modal显示内容
            subDisabled: false,
            paymentLoadError: false,//该支付方式载入失败，在切换支付方式的时候应该恢复false
            onGateWayItem: {},//当前选中项
        }
        this.successSubmitKey = '__chk_old_uuid'
    }
    UNSAFE_componentWillMount() {
        let { formData } = this.state;
        let { t } = this.props;
        let { order = {}, error_msg = '', shop = {} } = window.shopify_checkouts || {};
        let { address, email, shipping_rate_id, shipping_child_id, uuid, cpf, payment_method, payment_gate_way } = order || {};
        let { pay_pal_is_active, pay_pal_credit_is_active } = shop;//pay_pal_is_active是否显示pay_pal支付默认true
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
            let str = ['first_name', 'last_name', 'address1', 'address2', 'city', 'country', 'country_name', 'province', 'postal_code', 'phone'];
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
        payment_gate_way&&payment_method && (formData.payName = `${payment_method}-${payment_gate_way}`);//如果有默认选中项 就让他选中
        let i18nMessage = `cardError.${InitMessage(error_msg)}`;
        let paymentAlert = (t(i18nMessage) === i18nMessage ? error_msg : t(i18nMessage))//如果在cardError里匹配不到错误信息，就显示原始信息
        this.setState({ formData: Object.assign(formData, obj), paymentAlert, }, () => {
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
        if (document.documentElement.clientWidth < 600) {
            document.documentElement.style.fontSize = document.documentElement.clientWidth / 23.4375 + 'px'
            return
        }
        document.documentElement.style.fontSize = '16px'
    }
    componentDidMount() {
        let { order = {} } = window.shopify_checkouts || {};
        let { cpf } = order || {};
        this.resize();
        window.onresize = () => {
            this.resize();
        };
        console.log('did mount...')
        this.currentLng = (document.documentElement.lang || 'en').toLocaleLowerCase();
        window.currentLng = this.currentLng;
        this.CountDown();
        this.getLocal('init', () => {
            this.promiseAll();//初始化时候，以下两种都加载完成再执行
            !cpf && this.detectionCpf()//没有cpf才去检查需不需要cpf
            // this.getShippingZones();
            // this.getCountryOption();
        });
        window.addEventListener("popstate", (event) => {//非一级页面返回的，就刷新
            if (this.state.page) {
                location.hash = '';
                location.reload();
            } else {
                this.setState({ page: 0 })
            }
        });
        setTimeout(() => {
            this.createPaypalButton();
        })

        window.onerror = function (message, source, lineno, colno, error) {
            reportError("window.onerror", message)
        }
        if (window.shopify_checkouts) {
            const { order } = window.shopify_checkouts;
            page_loaded({ uuid: order.uuid });
        }
        try {
            getTongdun()
        } catch (error) {
            reportError("tongdun", error)
        }
        this.setPaymentLoadError();//子组件中不支持的支付方式时候的监听函数
    }
    setPaymentLoadError = () => {//子组件中不支持的支付方式时候的监听函数
        let { t } = this.props;
        this.PubSetPaymentLoadError = Pubsub.subscribe('setPaymentLoadError', (type, data) => {
            console.log('setPaymentLoadError', type, data);
            this.setState({ paymentLoadError: true, modalVisible: true, modalText: t('paymentMethod.changePayment') })
        });
    }
    detectionCpf = (data) => {
        //检测是否需要显示cpf
        let { onlyGetData = false } = data || {};
        let { t } = this.props;
        let { shippingAddress, formItme, formData } = this.state;
        let { country, payment_method } = formData;
        // let needCountry=['BR','CL'];
        let oldCpfObj = shippingAddress.find(item => item.name === 'cpf');
        let cpfItem = formItme.find(item => item.name === 'cpf');
        oldCpfObj && (oldCpfObj.isHide = true);
        cpfItem && (cpfItem.isHide = true);
        let oncpfObj = cpfObj({ t, country, payment_method, onlyGetData });
        if (oncpfObj.label) {
            if (oldCpfObj) {
                oldCpfObj = Object.assign(oldCpfObj, oncpfObj);
                oldCpfObj.isHide = false
            }
            if (cpfItem) {
                cpfItem = Object.assign(cpfItem, oncpfObj);
                cpfItem.isHide = false
            }
        }
        this.setState({ shippingAddress, formItme });
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
    setOnepageCheckoutIdentity(purchaseInfo) {
        if (purchaseInfo) {
            const onePageIdentityKey = "__onepage_checkout_source__";
            window.sessionStorage.setItem(onePageIdentityKey, JSON.stringify(purchaseInfo));
        }
    }

    createPaypalButton = () => {
        let paypalBtn = document.getElementById('paypal-button-container');
        if (!paypalBtn || (paypalBtn && paypalBtn.firstChild) || !window.paypal) { return }//如果有了 就不再生成了
        try {
            let _this = this;
            window.paypal.Buttons({
                locale: this.currentLng,
                style: {
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'paypal',
                },
                // presentation: {
                // 	brand_name: "hello.com"
                // },
                createOrder: function (data, actions) {
                    // This function sets up the details of the transaction, including the amount and line item details.
                    let { order = {}, shop = {} } = window.shopify_checkouts || {};
                    let { no_shipping_price = 0, currency } = order || {};
                    _this && _this.AddPaymentInfo()
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: no_shipping_price,
                                currency_code: currency,
                            },
                            custom_id: `opchkspy-${shop.name.replace('.myshopify.com', '')}`,
                        }]
                    });
                },
                onApprove: function (data = {}, actions) {
                    const { orderID, facilitatorAccessToken } = data || {};
                    const { t } = _this.props;
                    const { shipping_not_change } = _this.state;
                    if (!orderID) { return };
                    let { order = {} } = window.shopify_checkouts || {};
                    let { uuid, address } = order || {};
                    let { can_changed } = address || {};
                    let paypal_and_shipping_change = (can_changed !== false && !shipping_not_change)//默认为true
                    _this.setState({ visible: true });
                    if (paypal_and_shipping_change) {
                        _this.initAddress({ order_id: orderID, uuid }, { access_token: facilitatorAccessToken });
                    } else {//GALAXY等 不需要重置地址和shipping的情况
                        _this.notInitAddress({ order_id: orderID, access_token: facilitatorAccessToken });
                    }
                }
            }).render('#paypal-button-container');// eslint-disable-line
            //send facebook pixel events
            this.sendFacebookOtherEvents();
        } catch (err) {
            reportError("onepage createPaypalButton", err)
            return true
        }
    }
    //fast paypal时不重置Shipping address
    notInitAddress = (obj) => {
        let { formData = {} } = this.state;
        this.setState({ formData, paymentAlert: '', subLoading: true, paymentLoadError: false, subDisabled: false }, () => {
            let finalData = Object.assign({}, formData, obj, { payment_method: 'PayPal', payment_gate_way: 'fast_pay_pal' });
            this.post_checkout_deal(finalData)
        });
    }
    //fast paypal时初始化Shipping address
    initAddress = (value = {}, obj) => {//记得使用countryOption设置country_name
        let { formData = {}, shippingMethod = [], countryOption = [], pay_type } = this.state;
        // 初始化信息
        formData.country_name = '';
        formData.email = '';
        formData.address1 = '';
        formData.address2 = '';
        formData.city = '';
        formData.first_name = '';
        formData.last_name = '';
        formData.phone = '';
        formData.province = '';
        formData.province_name = '';
        formData.postal_code = '';

        get_paypal_shipping_info(value).then(res => {
            let { shippingInfo } = res || {};
            let { contactEmail = '', shippingAddress = {} } = shippingInfo || {};
            let { Address1 = '', Address2 = '', City = '', CountryCode = '', FirstName = '', LastName = '', Phone = '', Province = '', Zip = '' } = shippingAddress || {};
            formData.country = '';
            formData.country_name = ''
            if (CountryCode) {
                formData.country_name = ((countryOption.find(item => item.code === CountryCode) || {}).name || '');
                formData.country = CountryCode;
            }
            formData.email = contactEmail;
            formData.address1 = Address1;
            formData.address2 = Address2;
            formData.city = City;
            formData.first_name = FirstName;
            formData.last_name = LastName;
            formData.phone = Phone;
            formData.province = Province;
            formData.postal_code = Zip;
            //快捷支付这里不保存地址到本地
            let allArr = this.state.shippingAddress;
            allArr.splice(allArr.findIndex(item => item.name === '__sl_checkout_shippingaddr__'), 1);
            pay_type = 1;//默认0，快捷支付1
            formData.shipping_rate_id = '';
            formData.shipping_child_id = '';
            formData.order_id = value.order_id || '';
            formData = Object.assign(formData, obj);
            window.history.pushState({ page: 1 }, "", "#tag");
            formData.payment_method = 'PayPal';
            formData.payment_gate_way = 'fast_pay_pal';
            this.setState({ formData, formItme: shippingMethod, pay_type, shippingAddress: allArr, page: 1, paymentAlert: '', paymentLoadError: false, subDisabled: false }, () => {
                HAS_SHIPINGADDR = true;
                this.getLocal('country', () => {
                    this.postageFun();
                    !Phone && this.handleSimplify()
                });
                //check cpf 
                this.detectionCpf();//检测是否需要显示cpf

            });
        }).catch(err => {
            reportError('get_paypal_shipping_info', err)
            alert((err && err.responseText) || 'error');
            console.warn('get_paypal_shipping_info', err);
        }).finally(e => {
            this.setState({ visible: false })
        })
    }
    //获取国家对应的邮费计算表
    getShippingZones = async (type) => {
        let { shop = {} } = window.shopify_checkouts || {};
        let { identity_code, platform_name } = shop;
        if (platform_name === "SHOPIFY") {
            await get_shipping_zones({ identity_code }).then(res => {
                this.setState({ shipping_zones: res || [] });
                // if (HAS_SHIPINGADDR) {//若本地有数据，就直接计算
                // 	this.postageFun();
                // }
            }).finally(() => {
            })
        }
    }
    get_harbor_shipping_method = async () => {//shopify之外的类型获取邮费列表
        let { formData = {} } = this.state;
        if (!formData.country) { return }
        this.setState({ shippingMethodLoading: true });
        let { shop = {}, order = {} } = window.shopify_checkouts || {};
        let { name, platform_name } = shop;
        let { free_shipping_methods, no_shipping_price, shippingMethods = [] } = order;
        let shipping_method_list = [];
        // formData.shipping_rate_id = '';//移动到了上层函数postageFun统一处理
        if (platform_name === 'HARBOR') {
            await harbor_shipping_method({ shopName: name, free_shipping_methods, countryCode: formData.country || '', total_price: no_shipping_price }).then((res = {}) => {
                const { Data = [] } = res;
                if (Data instanceof Array && Data.length) {
                    Data.forEach(item => {
                        shipping_method_list.push({ shipping_rate_id: `${item.id}`, price: (item.price && item.price.priceValue) || 0, name: `${item.title}(${item.desc})` })
                    })
                }
            }).finally(e => {
                this.setState({ shipping_method_list, shippingMethodLoading: false });
            });
        } else {
            shippingMethods && shippingMethods.length > 0 && shippingMethods.forEach(item => {
                shipping_method_list.push({ shipping_rate_id: `${item.id}`, price: item.price || 0, name: item.methodName || '' });
            })
            this.setState({ shipping_method_list, shippingMethodLoading: false, shipping_not_change: true });
        }
    };
    //获取每一种支付方式对应的国家表
    getGatewayCountry = async (type = 'init', country_code, province = '') => {//type：update
        let { shop = {}, order = {} } = window.shopify_checkouts || {};
        let { identity_code = '' } = shop;
        let { uuid } = order || {};
        let { formData, pay_type, onGateWayItem } = this.state;
        if (pay_type === 1) { return };
        this.setState({ gatewayCountryLoading: true });//暂时不要加载中
        get_group_gateway_country({ identity_code, country_code: (country_code || formData.country), origin_host: location.origin, uuid }).then(res => {
            if (res && (res instanceof Array) && res.length) {
                let gatewayList = [];
                res.forEach(item => {
                    item.payName=`${item.payMethod}-${item.payGateWay}`;
                    if ((item.payGateWay === formData.payment_gate_way)&&(item.payMethod === formData.payment_method)) {
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
                        gatewayList.push({ ...item, payGateWay: "mada_credit", bindCards: mada_bindC,payName: `${item.payMethod}-mada_credit`});
                    } else {
                        gatewayList.push(item);
                    }
                });
                if (!onGateWayItem || !onGateWayItem.payGateWay) {
                    onGateWayItem = gatewayList[0];
                    formData.payment_gate_way = gatewayList[0].payGateWay;
                    formData.payment_method = gatewayList[0].payMethod;
                    formData.payName= gatewayList[0].payName;
                }
                this.setState({ gatewayList, formData, subDisabled: false, onGateWayItem, gatewayCountryLoading: false }, () => {
                    this.sinputChangetoPayment_gate_way(undefined, 'first');
                    HAS_SHIPINGADDR && this.setCardholderName(formData);//若本地有数据就设置信用卡数据
                });
            } else {
                throw res || ''
            }
        }).catch(err => {
            reportError("gatewayList is null", err);
            this.setState({ gatewayList: [], subDisabled: true, onGateWayItem: {}, gatewayCountryLoading: false });//gatewayList: [], 等后期该接口数据合并到初始化数据里去的时候再用
        }).finally(() => {
            this.setState({ gatewayCountryLoading: false });
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
                shipping_text = { title: t('shippingMethod.label'), content: `${s_L1.methodName || ''}, ${(s_L1.price * 1) > 0 ? `${currencySymbol()}${s_L1.price}` : t('Free')}`, btnText: '' };
            }
        }
        let { country_name = '', province = '', postal_code = '', email, country } = formData || {};
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
            shipToString = `${shipTo.toString() || ''} ${province} ${postal_code}, ${country_name}`;
            simplifyList.push({ title: t('ShipTo'), content: shipToString, btnText });
            shipping_text && simplifyList.push(shipping_text);//这里推了，formItme里的地址项就置空，如下
            this.setState({ isSimplify: true, simplifyList, formItme: (shipping_text ? [] : shippingMethod), formData }, () => {
                return callback && callback();
            });
        } else {
            formData.country = country || await this.initCountry();
            this.setState({ isSimplify: false, formItme: [...shippingAddress, ...shippingMethod], formData }, () => {
                // this.completedAutoCompleted('address1');
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
        get_all_country({ language: this.currentLng }).then((res = []) => {
            let { shippingAddress, formItme, formData, countryOption } = this.state;
            let formItmeCountry = formItme.find(item => item.name === 'country');
            shippingAddress.find(item => item.name === 'country').option = res || [];
            countryOption = res || [];
            formItmeCountry && (formItmeCountry.option = res || []);
            if (res && res[0]) {
                formData.country = formData.country || res[0].code;
                //初始化处理特殊国家
                !formData.country_name && (formData.country_name = ((res.find(item => item.code === formData.country) || {}).name) || '');
                this.setState({ shippingAddress, formItme, formData, countryOption });
                this.getProvinceOption('init', formData.country);
                this.getGatewayCountry('init', formData.country, formData.province || '');
            }
        }).catch(err => {
            reportError("getCountryOption", err)
        }).finally(e => {
        })
    }
    getProvinceOption = async (type, code, newProvince = '') => {//获取省
        if (!code) { return };
        let { shippingAddress, formItme, formData, } = this.state;
        let { province } = formData;
        province = newProvince || province;
        let provinceObj = formItme.find(item => item.name === 'province');
        if (!provinceObj) {//如果formItme(当前显示项)没有province，就不往下走了,初始化时候postageFun已经在promiseAll执行了
            type !== 'init' && this.postageFun();
            return;
        }
        provinceObj.isHide = true;
        provinceObj.option = [];
        formData.province_name = '';
        get_all_province({ code, language: this.currentLng }).then((res = []) => {
            let resLength = res && res.length > 0;
            provinceObj.isHide = !resLength;
            provinceObj.option = res || [];
            this.initItmeWidth({ type, resLength, formItme, shippingAddress });//处理输入框宽度
            if (resLength && province) {
                //判断输入的province是否有效
                let effective = {};
                res.forEach(item => {
                    if (item.code === province || item.name === province) {
                        effective = item
                    }
                });
                province = effective.code || '';
                formData.province_name = effective.name || '';
            } else {
                province = '';
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
        }).finally(() => {
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
        let maxtime = 599; // 
        let { t } = this.props;
        this.viewTime && (this.viewTime.innerText = `${t('countDown.running')} 10:00`);
        this.timer = setInterval(() => {
            let minutes = Math.floor(maxtime / 60);
            let seconds = Math.floor(maxtime % 60) || '0';
            seconds < 10 && (seconds = `0${seconds}`);
            if (maxtime > 0) {
                --maxtime;
                minutes = (minutes < 9 ? `0${minutes}` : minutes);
                this.viewTime && (this.viewTime.innerText = `${t('countDown.running')} ${minutes}:${seconds}`);
            } else {
                clearInterval(this.timer);
                this.viewTime && (this.viewTime.innerText = t('countDown.done'));
            }
        }, 1000);
    }
    sinputChange = (type, val, selectedName) => {
        const { state } = this;
        let { formData } = state;
        let { payment_gate_way } = formData;
        let { shop = {} } = window.shopify_checkouts || {};
        let { platform_name } = shop;
        if (type) {
            if ((type === 'country' || type === 'billing_country') && val != null) {
                this.getProvinceOption(type, val);
            }
            formData[type] = val;
            this.setState({ formData });
            if ((type === 'country') && val != null) {
                formData.country_name = (selectedName || val);
                this.setState({ formData });
                this.getGatewayCountry('country', val);
            }
            if (type === 'shipping_rate_id') {//change保存
                this.onBlurUpdateOrder(type, val);
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
        let { payGateWay, payMethod,payName } = data || {};
        let { formData, gatewayList, beforSub = [] } = this.state;
        let { payment_gate_way, payment_method } = formData;
        payGateWay = (payGateWay || payment_gate_way);
        payMethod = (payMethod || payment_method);
        payName = (payName || formData.payName);
        const onGateWayItem = (gatewayList.find(item => item.payName === payName)) || {};
        formData.payment_method = onGateWayItem.payMethod;
        formData.payment_gate_way = onGateWayItem.payGateWay;
        formData.payName = onGateWayItem.payName;
        this.setState({ formData, paymentLoadError: false,onGateWayItem }, () => {//切换支付方式的时候恢复paymentLoadError
            this.onBlurUpdateOrder();
            this.detectionCpf();
        });
    }
    setCardholderName = (formData) => {//设置信用卡对应名字
        this.refs.credit_card && this.refs.credit_card.setCardholder_name && this.refs.credit_card.setCardholder_name(formData)
    }

    getCurrentSkuIds = () => {
        let skuIds = []
        if (window.shopify_checkouts && window.shopify_checkouts.order) {
            for (let item of window.shopify_checkouts.order.items) {
                skuIds.push(item.sku)
            }
        }
        return skuIds
    }
    oceanpayment_service_fun = () => {
        window.history.pushState({ page: 1 }, "", "#tag");
        const { formData } = this.state;
        const { payment_method } = formData;
        this.setState({ formItme: [], page: 1, isSimplify: false }, () => {
            this.refs.credit_card && this.refs.credit_card.renderForm && this.refs.credit_card.renderForm((type, data) => {
                if (type === 'state') {
                    this.setState(data);
                } else if (type === 'error') {
                    this.returnLink();
                } else {
                    this.onsubmit()
                }
            })
        });
    }
    onsubmitVerifyFun = (hideError = false, noVerifyArr) => {//专门用来验证参数,hideError:是否隐藏校验的错误提示
        let { shop = {} } = window.shopify_checkouts || {};
        let { platform_name } = shop;//pay_pal_is_active是否显示pay_pal支付默认true
        let isGALAXY = (platform_name === "GALAXY");//GALAXY不验证
        let { formData, formItme, shippingAddress, isSimplify, shippingMethod } = this.state;
        const { special_zero } = formData;
        noVerifyArr = noVerifyArr || [];//不验证的项
        let addressOk = true, shippingOk = true;
        if (isGALAXY) {//如果是GALAXY，就只验证cpf
            for (let key in formData) {
                let value = formData[key];
                shippingAddress.forEach((item) => {//eslint-disable-line
                    if (item.name === 'cpf') {
                        item.isHide ? (item.error = false) : (item.name == key) && funverify({ value, verify: item.verify, item, scroll: true });//eslint-disable-line
                        if (item.error === true) {
                            addressOk = false;
                        }
                        (hideError && item.error === true) && (item.error = false);
                    }
                });
            }
            this.setState({ shippingAddress });
            return addressOk;
        };
        for (let key in formData) {
            if (!noVerifyArr.includes(key)) {
                let value = formData[key];
                //验证地址
                shippingAddress.forEach((item) => {//eslint-disable-line
                    item.isHide ? (item.error = false) : (item.name == key) && funverify({ value, verify: item.verify, item, scroll: true });//eslint-disable-line
                    if (item.error === true) {
                        addressOk = false;
                    }
                    (hideError && item.error === true) && (item.error = false);
                });
                //非0元购时候需要验证邮费
                if (!special_zero) {
                    shippingMethod.forEach((item) => {//eslint-disable-line
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
        return addressOk && shippingOk
    }

    cpfErrorSet = (err) => {//cpf错误时候的处理
        let { formData, formItme, shippingAddress, isSimplify, shippingMethod } = this.state;
        const { special_zero } = formData;
        formItme = (special_zero ? shippingAddress : [...shippingAddress, ...shippingMethod]);
        formItme.forEach((item) => {
            if (item.name === 'cpf') {
                item.isHide = false;
                item.error = true;
                item.message = err.message;
            }
        });
        if (isSimplify) {
            this.handleSimplify();
        }
        this.setState({ formItme }, () => {
            this.detectionCpf({ onlyGetData: true });
            setTimeout(() => {
                scrollToId('cpf');
            }, 20)
        });
    }
    onsubmit = async () => {
        let { order = {} } = window.shopify_checkouts || {};
        let { uuid = '', all_price = 0, special_zero } = order;
        if (uuid) {
            const { pay_type, formData, page } = this.state;
            if (!this.onsubmitVerifyFun()) { return };
            this.setAddress();
            let on_payment_method = init_on_payment_method(this.state);
            if (!special_zero && (on_payment_method === 'Ocean' && page === 0)) {
                this.oceanpayment_service_fun();
                return
            }
            // if (all_price <= 0) {//金额小于等于0，禁止提交
            // 	alert('Oops, there is something wrong while placing your order. Feel free to contact us if you have any questions.');
            // 	return false
            // }
            this.setState({ subLoading: true });
            let finalData = {};
            finalData = Object.assign({}, formData, { payment_method: on_payment_method });
            if (on_payment_method === 'PayPal') {//如果是快捷支付
            } else {
                if (computShowDom('paymentMethod', this)) {//如果有paymentMethod， 才去拿paymentMethod的参数
                    let cardData, billingData;//
                    cardData = new Promise((resolve) => {
                        this.refs.credit_card && this.refs.credit_card.getCreditCardData((data) => {
                            resolve(data)
                            console.log('cardData', cardData, billingData);
                        });
                    })
                    if (this.refs.BillingAddress) {
                        billingData = new Promise((resolve) => {
                            this.refs.BillingAddress && this.refs.BillingAddress.getCreditCardData((data) => {
                                resolve(data)
                                console.log('cardData', cardData, billingData);
                            });
                        })
                    } else {
                        billingData = new Promise((resolve) => {
                            resolve({});
                        })
                    }
                    return Promise.all([cardData, billingData]).then((re = []) => {
                        console.log('re', re);
                        if (re && re[0] && re[1]) {
                            finalData = Object.assign(finalData, re[0], re[1]);
                            this.post_checkout_deal(finalData);
                        } else {
                            this.setState({ subLoading: false });
                            console.log('finalData', finalData, re[0], re[1]);
                        }
                    }).catch(err => {
                        this.setState({ subLoading: false, visible: false });
                    })
                }
            }
            this.post_checkout_deal(finalData);
        } else {
            alert('The order is invalid! Please return to the shopping cart to try again')
        }
    }

    post_checkout_deal = (finalData) => {//最后提交
        if (this.hasSuccessedSubmit()) {
            window.location.reload(true)
            return
        }
        let { order = {} } = window.shopify_checkouts || {};
        let { uuid } = order;

        const { pay_type, formData, page } = this.state;
        let { shop = {} } = window.shopify_checkouts || {};
        let { platform_name } = shop;
        let shipping_rate_id = formData.shipping_rate_id.split('-')[0];
        let shipping_child_id = formData.shipping_rate_id.split('-')[1];
        finalData.shipping_rate_id = shipping_rate_id;
        finalData.shipping_child_id = shipping_child_id || '';
        let arr = ['credit', 'mada_credit'];//这些卡都改成credit;
        if (arr.includes(finalData.payment_gate_way)) {
            finalData.payment_gate_way = 'credit'
        }
        /**
         * 排除不上传的参数begin
         */
        finalData.__sl_checkout_shippingaddr__ !== undefined && (delete finalData.__sl_checkout_shippingaddr__);
        /**
         * end
         */
        if (pay_type === 0) {
            this.AddPaymentInfo();
        }
        // console.log('finalData',finalData);
        // this.setState({ paymentAlert: '', subLoading: false, visible: false });
        // return //demo
        this.setState({ sub_error_obj: {}, paymentAlert: '' });
        finalData.platform = window.shopify_checkouts && window.shopify_checkouts.shop && window.shopify_checkouts.shop.platform
        finalData.language = window.shopify_checkouts && window.shopify_checkouts.shop && window.shopify_checkouts.order.language

        checkout_deal(finalData).then(async (res = {}) => {
            let { order = {} } = window.shopify_checkouts || {};
            let { uuid = '' } = order;
            let { url, totalPrice, currency, urlType, can_click_back = false } = res || {};
            url = url || '';
            this.setOnepageCheckoutIdentity({ value: totalPrice, currency, content_type: 'product_group', content_ids: this.getCurrentSkuIds() });
            const can_back = (can_click_back || url.includes('paypal.com'));
            if (can_click_back && url) {
                //如果是可以返回的url，就记录一下该url
                window.sessionStorage.setItem(CAN_CLICK_BACK, uuid);
                //这里暂存用户选中的支付方式，避免用户使用浏览器返回的时候shopify_checkouts对象没有被及时更新
                window.sessionStorage.setItem('payment_gate_way', finalData.payment_gate_way);
                window.sessionStorage.setItem('payment_method', finalData.payment_method);
            }
            if (platform_name === "SHOPIFY") {
                await this.clearCart();
            }
            if (urlType === 'approve') {
                if (can_back) {//如果是paypal就不用替换的跳转，让他可以返回
                    window.location.href = (url || '/');
                } else {
                    window.location.replace(url || '/');
                }
                setTimeout(() => {//location.href无法马上跳转，延迟3秒后恢复状态
                    this.setState({ subLoading: false });
                }, 3000);
            } else {
                this.sendPurchaseEvents(totalPrice, currency, pay_type);
                if (uuid) {
                    this.saveSubmitSuccessIdentity(uuid)
                }
                setTimeout(() => {
                    if (can_back) {//如果是paypal就不用替换的跳转，让他可以返回
                        window.location.href = (url || '/');
                    } else {
                        window.location.replace(url || '/');
                    }
                    setTimeout(() => {//location.href无法马上跳转，延迟3秒后恢复状态
                        this.setState({ subLoading: false });
                    }, 3000);
                }, 1000);
            }

        }).catch((err) => {
            let { message, message_key, status } = err;
            let paymentAlert = message;
            if (CPF_ERROR_CODE.includes(message_key)) {
                if (message_key === 'BP-DR-98') {//BP-DR-98税号不匹配
                    this.refs.credit_card && this.refs.credit_card.setData && this.refs.credit_card.setData('error', err)
                } else {
                    this.cpfErrorSet(err)
                }
            }
            if (message_key === 'refresh_data') {//分期不存在的时候
                this.getGatewayCountry('update');
            }
            if (finalData.payment_method === 'Checkout' && message_key === 'change_pacypay_tip') {//切换支付方式
                paymentAlert = '';
                this.change_pacypay_tip();
            }
            this.setState({ sub_error_obj: err || {}, paymentAlert, subLoading: false, visible: false });
            //钱海第二个页面失败的时候给他刷新页面
            if (finalData.payment_method === 'Ocean' && page === 1) {
                this.oceanpayment_service_fun();
                return
            }
            if (!status) {
                reportError("post_checkout_deal", err)
            }
        }).finally(e => {
        })
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

    sendPurchaseEvents = (price, currency, payType) => {//发送购买信息
        let { shop = {} } = window.shopify_checkouts || {};
        let { platform_name } = shop;
        const isHarbor = platform_name === "HARBOR";

        // if (typeof (window.fbq) === 'function') {
        if (!isHarbor) {
            // window.fbq('track', 'Purchase', { value: price, currency, content_type: 'product_group', content_ids: this.getCurrentSkuIds() });
            // this.setOnepageCheckoutIdentity({ value: price, currency, content_type: 'product_group', content_ids: this.getCurrentSkuIds() });
            if (window.gtag) {
                window.gtag('event', 'purchase', { value: price, currency });
                console.log('send google purchase from one checkout page.')
            }
            if (window.ga) {
                ga('require', 'ec');
                ga('set', 'currencyCode', currency);
                ga('ec:setAction', 'purchase', {
                    'id': window.shopify_checkouts && window.shopify_checkouts.order && window.shopify_checkouts.order.uuid,
                    'revenue': price,
                });
                ga('send', 'pageview');
            }
        }
        // if (payType === 1) {
        // 	//express palpay 
        // 	window.fbq('trackCustom', 'PaypalExpressPay', { value: price, currency });
        // } else {
        // 	window.fbq('trackCustom', 'CreditPay', { value: price, currency });
        // }
        // }
    }

    AddPaymentInfo = () => {
        try {
            let { order = {} } = window.shopify_checkouts || {};
            let { items = [], currency, all_price } = order || {};
            let content_ids = [];
            items.length > 0 && items.forEach(item => {
                content_ids.push(item.sku);
            });
            // content_ids=content_ids.toString();
            let obj = { content_type: 'product_group', content_ids, value: all_price, currency }
            window.fbq && window.fbq('track', 'AddPaymentInfo', obj);
        } catch (e) {
            reportError("onepage AddPaymentInfo", e)
            console.log('AddPaymentInfo error', e);
        }
    }

    sendFacebookOtherEvents = () => {
        let { order = {} } = window.shopify_checkouts || {};
        let { uuid = '' } = order;
        if (!sessionStorage.getItem(uuid)) {
            sessionStorage.setItem(uuid, 1);
            if (typeof (window.fbq) === 'function') {
                window.fbq('trackCustom', 'OnePageCheckoutView');
                this.InitiateCheckout()
            }
        }
    }
    InitiateCheckout = () => {
        let { order = {} } = window.shopify_checkouts || {};
        let { items = [], currency, total_price } = order || {};
        let content_ids = [];
        let num_items = items.length || 0;
        num_items > 0 && items.forEach(item => {
            content_ids.push(item.sku);
        });
        // content_ids=content_ids.toString();
        let obj = { content_type: 'product_group', content_ids, value: total_price, num_items, currency }
        window.fbq && window.fbq('track', 'InitiateCheckout', obj);
    }
    //是否成功提交过
    hasSuccessedSubmit = () => {
        let { order = {} } = window.shopify_checkouts || {};
        let { uuid = '' } = order;
        let old_uuid = window.localStorage.getItem(this.successSubmitKey);
        if (old_uuid && old_uuid === uuid) {
            return true;
        } else {
            return false;
        }
    }
    //保存成功提交的key
    saveSubmitSuccessIdentity = (uuid) => {
        window.localStorage.setItem(this.successSubmitKey, uuid);
    }
    onBlurUpdateOrder = (type = '', val) => {//保存用户信息
        let { formData, formItme, gatewayList } = this.state;
        if (type && val && formData[type]) { formData[type] = val };
        let { shipping_rate_id = '', email, payment_gate_way } = formData;
        if (!email) { return };
        let isError = ((formItme.find(it => it.name === type) || {}).error) || false;
        let emailError = ((formItme.find(it => it.name === 'email') || {}).error) || false;
        if (isError || emailError) { return };
        let exclude = [];//排除项
        let obj = Object.assign({}, formData);
        let on_gate_way_item = (gatewayList.find(item => item.payGateWay === payment_gate_way)) || {};
        obj.payment_method = on_gate_way_item.payMethod;
        obj.shipping_rate_id = shipping_rate_id.split('-')[0];
        obj.shipping_child_id = shipping_rate_id.split('-')[1];
        let arr = ['credit', 'mada_credit'];
        if (arr.includes(obj.payment_gate_way)) {
            obj.payment_gate_way = 'credit';
        }
        exclude.length > 0 && exclude.forEach(item => {
            delete obj[item];
        });
        update_draft_order(obj)
    }

    clearCart = () => {
        const fromBuyItNowKey = "__from_buy_it_now__"
        if (window.sessionStorage.getItem(fromBuyItNowKey)) {
            return new Promise((resolve, reject) => {
                resolve()
            })
        } else {
            // url = `//${window.shopify_checkouts.shop.domain}/cart/clear.js`
            return new Promise((resolve, reject) => {
                /* $.ajax({
                    type: 'post',
                    url: '/cart/clear.js',
                    dataType: 'json',
                    crossDomain: true,
                    success: (dt) => {
                        resolve()
                    },
                    error: () => {
                        reject()
                    }
                }) */

                post('/cart/clear.js')
                    .then(() => {
                        resolve()
                    })
                    .catch(() => {
                        reject()
                    })
            }).catch(e => {

            })
        }

    }
    handleCancel = () => {
    }
    shipping_methodChange = (value) => {
        this.sinputChange('shipping_rate_id', value);
    }
    promiseAll = () => {
        let { country } = this.state.formData;
        this.setState({ shippingMethodLoading: true });
        if (country) {//如果有country就不等getCountryOption了
            Promise.all([this.getShippingZones()]).then(res => {
                this.postageFun(true)
            }).finally(e => {
                this.setState({ shippingMethodLoading: false });
            });
            this.getCountryOption()
        } else {
            Promise.all([this.getCountryOption(), this.getShippingZones()]).then(res => {
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
        if (platform_name === "SHOPIFY") {
            shipping_method_list = [];
            shipping_zones.forEach((itemParent) => {
                const { countries, price_based_shipping_rates = [] } = itemParent;
                let tax, shipping_rate_id, countryItem = {}, provincesItem, shipping_zone_id;
                countryItem = countries.find(item => item.code === country) || null;
                if (!countryItem) { return false };
                let provinces = countryItem.provinces || [];
                shipping_zone_id = countryItem.shipping_zone_id;
                tax = countryItem.tax;
                shipping_rate_id = itemParent.id;
                provincesItem = provinces.find(item => item.Code === province);//保存省的项
                if (countryItem.provinces && countryItem.provinces.length && provincesItem) {//有对应的省
                    shipping_zone_id = provincesItem.shipping_zone_id;
                    tax = provincesItem.tax;
                }
                price_based_shipping_rates.forEach(item => {//获取包邮价格min_order_subtotal
                    let priceItam;
                    let { min_order_subtotal, max_order_subtotal } = item || {};
                    let min_price = (min_order_subtotal && min_order_subtotal * 1) || 0;
                    let max_price = (max_order_subtotal && max_order_subtotal * 1) || 9999999;
                    if (item.shipping_zone_id === shipping_zone_id) {
                        if ((no_shipping_price >= min_price) && (no_shipping_price < max_price)) {
                            priceItam = item;
                            shipping_rate_id = `${itemParent.id}-${item.id}`;
                        }
                    }
                    priceItam && shipping_method_list.push({ ...priceItam, tax, shipping_rate_id });
                });
            });
            await this.setState({ shipping_method_list });
        } else {
            if (!shipping_method_list || shipping_method_list.length === 0) {
                await this.get_harbor_shipping_method();
            }
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
                return item[type]
            } else {
                return item
            }
        } else {
            return {}
        }
    }
    completedAutoCompleted = (inputType) => {//inputType值有：address1、billing_address1
        let _this = this;
        let { t } = this.props;

        /* old */
        // let inputAddress1 = $(`input#${inputType}`)[0];

        /* new */
        let inputAddress1 = querySelector(`input#${inputType}`);

        if (!inputAddress1) {
            console.warn('google required dom is undefined');
            return
        };
        listenerGoogleKeyError({ id: inputAddress1, placeholder: t('shippingAddress.address') });//添加监听密钥无效的情况
        var autocomplete = new google.maps.places.Autocomplete(inputAddress1, {});
        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            inputAddress1.blur();
            let { formatted_address = '', address_components = [] } = autocomplete.getPlace();
            let address = formatted_address.split(",")[0];
            if (!address) return;
            let { formData, formItme, countryOption } = _this.state;
            let oldCountry = formData.country || '';
            let oldProvince = formData.province || '';
            if (inputType === 'address1') {
                formData[inputType] = address
            }
            for (let item of address_components) {
                for (let tp of item.types) {
                    switch (tp) {
                        case 'locality':
                            if (item.long_name) {
                                if (inputType === 'address1') {
                                    formData.city = item.long_name;
                                    item.long_name && (formItme.find(item => item.name === 'city').error = false);
                                }
                            }
                            break
                        case 'country':
                            if (item.short_name) {
                                if (inputType === 'address1') {
                                    formData.country = item.short_name;
                                    countryOption && (formData.country_name = ((countryOption.find(item => item.code === formData.country) || {}).name) || '')
                                }
                            }
                            break
                        case 'administrative_area_level_1':
                            if (item.short_name) {
                                if (inputType === 'address1') {
                                    formData.province = item.short_name
                                }
                            }
                            break
                        case "postal_code":
                            if (item.long_name) {
                                if (inputType === 'address1') {
                                    formData.postal_code = item.long_name;
                                    item.long_name && (formItme.find(item => item.name === 'postal_code').error = false);
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            _this.setState({ formData }, () => {
                if (inputType === 'address1') {
                    _this.onBlurUpdateOrder(inputType);
                    if (formData.country !== oldCountry) {
                        _this.getGatewayCountry('country', formData.country);
                    }
                    if (formData.country !== oldCountry || formData.province !== oldProvince) {
                        formData.country && (_this.getProvinceOption('country', formData.country));
                    }
                }
            })


        });
    }
    handleSimplify = (type) => {//点击change
        const { shippingAddress = [], shippingMethod = [], formData } = this.state;
        const { country, province, special_zero } = formData;
        this.setState({ isSimplify: false, formItme: special_zero ? shippingAddress : [...shippingAddress, ...shippingMethod] }, () => {
            this.getProvinceOption('init', country);//change后才有必要请求province list
            let emailDom = document.getElementById('email');
            emailDom && emailDom.focus();
            // this.completedAutoCompleted('address1');
        })
    }
    returnLink = (e) => {
        let evt = e || window.event; //获取event对象
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
        if (this.state.page === 1) {
            history.go(-1);
            location.hash = '';
        } else {
            location.href = '/cart';
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
    paypalLaterUI = () => {
        if (window.shopify_checkouts && window.shopify_checkouts.shop && window.shopify_checkouts.shop.pay_pal_is_active) {
            let { order = {}, shop = {} } = window.shopify_checkouts || {};
            let { all_price = 0 } = order;
            const { default_country = "" } = shop;
            const { formData } = this.state;
            const { country } = formData || {};
            return default_country === "US" && country === "US" && all_price > 0 && <div className={styles.paypalLater}>
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
    }
    render_gate_way = () => {
        const { t } = this.props;
        const { gatewayList } = this.state;
        let newList = [];
        gatewayList.forEach(it => {//跟Galaxy的区别，去掉fast_pay_pal
            if (it.payGateWay !== 'fast_pay_pal') {
                newList.push(it);
            }
        });
        return <Cards t={t} parentState={this.state} ref='credit_card' payChange={this.sinputChangetoPayment_gate_way} onChange={this.sinputChange} cards={newList} currentLng={this.currentLng} />
    }
    changeModalVisible = () => {
        this.setState({ modalVisible: false });
    }

    render() {
        const { t } = this.props;
        const { subDisabled = false, paymentLoadError = false, shipping_not_change, paymentAlert, modalVisible, modalText, gatewayCountryLoading = false, pay_type = 0, page = 0, formItme, formData, visible, shipping_method_list = [], subLoading, simplifyList = [], isSimplify = false, shippingMethodLoading = false } = this.state;
        const { payment_gate_way, payment_method, shipping_rate_id = '', special_zero, country } = formData || {};// eslint-disable-line
        let { order = {}, shop = {} } = window.shopify_checkouts || {};
        let { uuid, address } = order || {};
        let { can_changed } = address || {};
        let { domain = '', platform_name, font_family = '', pay_pal_is_active } = shop;//pay_pal_is_active是否显示pay_pal支付默认true
        let oceaning = (payment_method === 'Ocean' && page === 0);
        let subBtnText = oceaning ? t('ContinueToPayment') : t('completedPurchaseBtn');
        let isGALAXY = (platform_name === "GALAXY");
        let paypal_and_shipping_change = (can_changed !== false && !shipping_not_change)//默认为true
        let address_dom = (isDown) => {//判断地址和邮费生成的位置在哪儿
            if ((paypal_and_shipping_change && isDown) || (!paypal_and_shipping_change && !isDown)) {
                return (<>
                    {isSimplify && <div style={{ paddingTop: '15px' }}><Slist list={simplifyList} onClick={this.handleSimplify.bind(this)} /></div>}
                    {formItme.map((item, index) => {
                        if (item.type === 'title') {
                            return <div key={index} className={styles.title}>{item.name}</div>
                        } else if (item.type === 'checkbox') {
                            return <Scheckbox style={{ padding: '0 0.43em' }} id={item.name} checked={formData[item.name] === undefined ? this.state[item.name] : formData[item.name]} key={index} onChange={this.sinputChange.bind(this, item.name)} >{item.placeholder}</Scheckbox>
                        } else if (item.type === 'select' && !item.isHide) {
                            return <Sselect id={item.name} onBlur={this.onBlurUpdateOrder.bind(this, item.name)} className={classNames(item.dynamic === 50 && styles.width50, item.dynamic === 30 && styles.width30)} option={item.option} value={formData[item.name]} verify={item.verify} item={item} key={index} placeholder={item.placeholder} onChange={this.sinputChange.bind(this, item.name)} />
                        } else if (item.type === 'input' && !item.isHide) {
                            return <Sinput type={item.types} id={item.name} onBlur={this.onBlurUpdateOrder.bind(this, item.name)} className={classNames(item.dynamic === 50 && styles.width50, item.dynamic === 30 && styles.width30)} value={formData[item.name]} verify={item.verify} item={item} key={index} placeholder={item.placeholder} onChange={this.sinputChange.bind(this, item.name)} maxLength={item.maxLength} />
                        } else if (item.type === 'addressSelection') {
                            return <AddressSelection not_change={shipping_not_change} loading={shippingMethodLoading} id={item.name} item={item} verify={item.verify} key={index} list={shipping_method_list} value={shipping_rate_id} onChange={this.shipping_methodChange} t={t} />
                        } else {
                            return null
                        }
                    })}
                </>)
            }
        }
        let isRtl = (this.currentLng === 'ar');
        return (
            <div className={classNames(styles.box, isRtl ? styles._rtl : '')} style={font_family ? { fontFamily: font_family } : null}>
                <div className={styles.app}>
                    <div className={styles.formData}><Logo style={{ padding: '0.5rem' }} /></div>
                    <ShowOrder formData={formData} className={styles.showOrder} special_zero={special_zero} hideInput={payment_gate_way === 'ocean_credit' && page === 1} shipping={this.getPostageData('price') || 0} tax={this.getPostageData('tax') || 0} callback={(e) => this.showOrderBack(e)} />
                    <div className={styles.formData}>
                        {computShowDom('hot', this) && <><div className={styles.hot}> <span role="img" aria-label='hot'>🔥</span> {t('caption.label')}</div>
                            <div className={styles.countDown}>
                                <span style={{ color: 'rgb(0, 0, 0)', fontSize: '14px' }} ref={e => this.viewTime = e}></span>
                            </div></>}
                        <div>
                            {address_dom(false)}
                            <div className={computShowDom('fastPaypal', this) ? '' : styles.hidden}>
                                <div className={styles.btnParent}>
                                    <div className={styles.expressChk}>{t('expressCheckout')}</div>
                                    <div id="paypal-button-container"></div>
                                    <div><RenderCardImg icon={'che_ad_wo'} /></div>
                                    {this.paypalLaterUI()}
                                </div>
                                <div className={styles.or}><span>{t('checkoutOr')}</span></div>
                            </div>
                            {address_dom(true)}
                            <div>
                                {computShowDom('paymentMethod', this) && <div className={styles.payment_method}>
                                    <div className={styles.title}>{t('paymentMethod.label')}</div>
                                    <div className={styles.textGray}><span>{t('paymentMethod.subLabel')}</span></div>
                                </div>}
                                <div style={{ padding: '0 0.42143rem' }}><Salert type='error' value={paymentAlert} /></div>
                                {computShowDom('paymentMethod', this) && <>
                                    <div style={{ padding: '0 0.43em' }}>{this.render_gate_way(payment_gate_way)}</div>
                                    <div style={{ margin: '0.35rem 0.35rem 0' }}><Stips value={t('paymentMethod.cardSafeTips')} /></div>
                                    {/* {payment_method !== 'Ocean' && payment_gate_way === 'credit' && <div className={styles.billingAddress}>
										<div className={styles.title}>{t('paymentMethod.billingAddress.title')}</div>
										<div className={styles.textGray}><BillingAddress t={t} ref="BillingAddress" parentState={this.state} /></div>
									</div>} */}
                                </>}
                            </div>
                            <div className={styles.completeBox}>
                                <div className={styles.complete}>
                                    <a className={styles.black} onClick={(e) => { this.returnLink(e) }} href="/">{isGALAXY ? '' : <><svg version="1.1" viewBox="0 0 10 10" style={{ width: '9.8px', position: 'relative', top: '1px', marginRight: '0.25rem' }}><path fill="currentColor" d="M8 1L7 0 3 4 2 5l1 1 4 4 1-1-4-4"></path></svg>{page === 0 ? t('returnToCart.label') : t('paypalSecondPageReturn')}</>}</a>
                                    {computShowDom('subBtn', this) && <Sbutton id={!oceaning && 'payNow'} type='green' size='large' onClick={this.onsubmit} loading={subLoading} disabled={subDisabled || gatewayCountryLoading || paymentLoadError}>{subBtnText}</Sbutton>}
                                </div>
                                <div className={styles.feedback}><Feedback formData={formData} /></div>
                            </div>
                            <div className={styles.chooseUs}><ChooseUs /></div>
                            <div className={styles.logo}>{t('footer.allRightsReserved')} {domain || 'labigail'}</div>
                        </div>
                    </div>
                </div><div className={styles.rightMain} />
                {/* <Sdialog closable={false} className={styles.loadingDialog} onClose={this.handleCancel} visible={visible} animation="zoom" maskClosable={false}>
					<p>Please wait……</p>
				</Sdialog> */}
                <Sloading visible={visible} t={t} />
                <Smodal visible={modalVisible} onOk={this.changeModalVisible}>{modalText}</Smodal>
            </div>
        );
    }
}

export default withTranslation()(Index);
