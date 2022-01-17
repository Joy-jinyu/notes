/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import { CreditCard, Adyen, Klarna, CreditTitle, BillingAddress } from "../index"
import { loadscript, initCardIocn, funverify, AppleGooglePay } from "../../../utils"
import { SkeletonCard, Sicon, Sselect, Sradio } from "../../index";
import AfterPayFun from "../AfterPay"
import ApplePay from "../ApplePay"
import * as Stabs from "../../Stabs";
import { get_bank_list } from "../../../api/api"
import styles from './style.module.scss';
// import Checkout from "../Checkout/checkout";
const { Tabs, TabPane } = Stabs;
class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
            on_payment_gate_way: '',
            on_country: '',
            payList: {
                fast_pay_pal: { label: t('paymentMethod.paypal.label') },
                pay_pal_credit: { label: t('paymentMethod.creditCard.PayPalCreditTip') },
                oxxo: { label: 'OXXO' },
                spei: { label: 'SPEI' },
                servipag: { label: 'ServiPag' },
                multicaja: { label: 'Multicaja' },
                sencillito: { label: 'Sencillito' },
                webpay: { label: 'WebPay' },
                pagoefectivo: { label: 'PagoEfectivo' },
                safetypay_cash: { label: 'SafetyPay' },
                giropay: { label: 'Giropay' },
                sofort: { label: t('paymentMethod.Sofortbanking') },
                knet: { label: 'KNET' },
                qpay: { label: 'QPay' },
                pse: { label: 'PSE' },
                boleto: { label: 'Boleto' },
                apple_pay: { label: 'Apple Pay' },
                klarna_us: { label: '4 interest-free payments' },
                klarna_uk: { label: '3 interest-free payments' },
                klarna_eu: { label: '', subhead: t('paymentMethod.klarnaEuTitle') },
                afterpay_au: { label: 'Afterpay' },
                afterpay_us: { label: 'Afterpay' },
            },
            extra_data: {},
            extra_list: [{
                name: 'eft_code', type: 'select', placeholder: t('shippingAddress.selectBank'), option: [], verify: [{ required: true }]
            }],
            initCards: [],
            credits: ['credit', 'mada_credit'],
            isAgreeBind: false,//是否记住卡
            isMore: false,//是否显示更多
            gateWayIndex: 0,//当前选定的支付方式项
            subSuccessData: { apple_pay: null },//只提交时候保存收到的数据，数据用于Apple Pay支付
        };
    }
    componentDidMount() {//为了在初始化时候执行一次
        this.parentInit(this.props);
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextState) {//初始化时候不执行
        this.parentInit(nextProps);
    }
    parentInit = (props) => {
        let { on_payment_gate_way, on_country, initCards = [] } = this.state;
        let { formData } = props.parentState || {};//cards
        let { payment_gate_way, payment_method, country } = formData || {};//cards
        if ((payment_gate_way !== on_payment_gate_way) || (country !== on_country)) {
            this.setState({ on_payment_gate_way: payment_gate_way, on_country: country });
            if (payment_gate_way === 'pse') {
                this.get_bank_list_fun();
            } else if (payment_method === 'AfterPay') {
                AfterPayFun.load({ isPreload: false, cards: props.cards || [], formData })
            }
        }
        if (JSON.stringify(props.cards) !== JSON.stringify(initCards)) {
            this.initCards();
            AfterPayFun.load({ isPreload: payment_method !== 'AfterPay', cards: props.cards || [], formData });
        }

    }
    setData = (type, data) => {
        this.refs.credit.setData && this.refs.credit.setData(type, data);
    }
    initCountry = (data = {}) => {
        this.refs.credit && this.refs.credit.initCountry(data);
    }
    getCreditCardData = async (callback) => {//验证是否合格
        let { extra_data, extra_list, initCards, gateWayIndex } = this.state;
        const { parentState } = this.props;
        const { formData } = parentState;
        const { payment_gate_way } = formData;
        let arr = ['klarna_us', 'klarna_uk', 'klarna_eu', 'credit', 'mada_credit'];
        const { tabsActive, isAgreeBind, clientIdentity } = initCards[gateWayIndex] || {};
        if (arr.includes(payment_gate_way)) {
            let cardData, billingData;//
            if (tabsActive === 'old') {//用的绑卡
                cardData = { clientIdentity }
            } else {
                cardData = new Promise((resolve, reject) => {
                    let refs = this.refs[payment_gate_way];
                    refs && refs.getCreditCardData((data) => {
                        if (data) {
                            data = { ...data, isAgreeBind }
                        }
                        resolve(data)
                    });
                })
            }
            billingData = new Promise((resolve) => {
                if (this.billingRef) {
                    this.billingRef.getCreditCardData((data) => {
                        resolve(data);
                    });
                } else {
                    resolve({ is_same_address: true })
                }
            })
            return Promise.all([cardData, billingData]).then((re = []) => {
                console.log('cards', re);
                if (re && re[0] && re[1]) {
                    callback(Object.assign({}, re[0], re[1]));
                } else { callback() }
            }).catch(err => {
                console.log('cardscatch', err);
                callback()
            });
        } else {
            let isOk = true;
            if (payment_gate_way === 'pse') {
                extra_list.forEach((item, index) => {//eslint-disable-line
                    funverify({ value: extra_data.eft_code, verify: item.verify, item, scroll: true });
                    (item.error === true) && (isOk = false);
                })
            }
            if (isOk) {
                if (payment_gate_way === 'fast_pay_pal') {
                    //fast_pay_pal也可能到这儿，因为0元购的时候后端也要求触发提交
                    return callback({});
                }
                callback(extra_data)
            } else {
                this.setState({ extra_list });
                callback()
            }
        }
    }
    // renderForm = (callback) => {//钱海才有的
    //     this.refs.credit && this.refs.credit.renderForm(callback);
    // }
    setCardholder_name = (formData) => {//用户外部修改Shipping address触发
        this.refs.credit && this.refs.credit.setCardholder_name(formData);
    }
    onChange = (item, gateWayIndex) => {
        const { parentState, onChange, payChange } = this.props;
        const { formData } = parentState;
        const { payment_gate_way, payName } = formData;
        const { initCards } = this.state;
        if (payName !== item?.payName) {
            if (gateWayIndex || gateWayIndex === 0) {
                initCards.forEach((it, index) => {
                    if (it.payName === item?.payName) {
                        gateWayIndex = index;
                    }
                });
                this.setState({ gateWayIndex });
            }
            payChange && payChange(item);
        }
    }
    get_bank_list_fun = () => {
        const { parentState, onChange } = this.props;
        const { formData } = parentState;
        let { country } = formData || {};//cards
        get_bank_list({ country }).then(bank_list => {
            if (!(bank_list instanceof Array)) {
                bank_list = []
            }
            let { extra_data } = this.state;
            let { eft_code } = extra_data;
            extra_data.eft_code = (bank_list[0].code || eft_code);
            this.setState({ bank_list, extra_data });
        })
    }
    initCards = async () => {
        let { t, cards = [], parentState } = this.props;
        const { formData } = parentState;
        const { payment_gate_way } = formData;
        let { payList, credits, gateWayIndex } = this.state;
        cards.forEach((item, index) => {
            if (item.payGateWay === payment_gate_way) {
                gateWayIndex = index;
            }
            item.subhead = payList[item.payGateWay]?.subhead;
            item.label = payList[item.payGateWay]?.label;
            item.icon = item.payGateWay;
            switch (item.payGateWay) {
                case 'credit':
                    let { instalments } = item;
                    if (instalments && instalments.length) {//有分期信息的时候
                        item.label = t('paymentMethod.creditCard.labelInstallment');
                        item.icon = `${item.payMethod}_credit_instalments`;
                    } else {
                        item.icon = `${item.payMethod}_credit`;
                        item.label = t('paymentMethod.creditCard.label');
                    }
                    if (item.bindCards && item.bindCards.length) {//如果有绑卡，就设定一下默认值
                        item.tabsActive = 'old';
                        item.clientIdentity = item.clientIdentity || item.bindCards[0]?.clientIdentity;
                    } else { item.tabsActive = 'new' };
                    break;
                case 'mada_credit':
                    if (item.bindCards && item.bindCards.length) {//如果有绑卡，就设定一下默认值
                        item.tabsActive = 'old';
                        item.clientIdentity = item.clientIdentity || item.bindCards[0]?.clientIdentity;
                    } else { item.tabsActive = 'new' };
                    break;
                case 'apple_pay':
                    item.isHide = true;//不确定设备是否支持，先隐藏
                    if(item.payMethod==='Stripe'){
                        this.init_apple_pay_stripe(item,cards);
                    }else{
                        this.init_apple_pay(item,cards);//再判断
                    }
                    break;
                default:
                    break;
                //510107201712016352
            }
        });
        this.setState({ initCards: cards, gateWayIndex });
        return cards || []
    }
    initMain = (item) => {
        let textMains = ['fast_pay_pal', 'pay_pal_credit'];//显示类
        let arr = ['klarna_us', 'klarna_uk', 'klarna_eu', 'credit', 'mada_credit'];
        if (arr.includes(item.payGateWay)) {
            if (item.bindCards && item.bindCards.length) {//如果有绑卡，就设定一下默认值
                return this.createCard(item);
            } else { return this.render_gate_way(item) };
        } else if (textMains.includes(item.payGateWay) || item.payMethod === 'AfterPay') {
            return this.textMain(item)
        } else {
            if (item.payMethod === 'Ebanx') {
                return this.ebanxMain(item)
            }
        };
    }
    //绑卡
    createCard = (item) => {
        let { t } = this.props;
        let { clientIdentity, isMore = false } = item;
        let { bindCards = [], tabsActive = 'new' } = item || {};
        const nowcards = () => {
            if (isMore || (bindCards && bindCards.length < 4)) {//如果是展开的
                return bindCards || [];
            } else {
                return bindCards.slice(0, 3) || [];
            }
        }
        let nowList = nowcards();
        return <Tabs defaultActiveKey={tabsActive} onChange={this.changeInitCardsItem.bind(this, 'tabsActive')}>
            <TabPane tab={t('paymentMethod.UseCurrentCard')} key="old">
                <ul className={styles.clientIdentityList}>
                    {nowList.map(it => {
                        return <li key={it.clientIdentity} onClick={this.changeInitCardsItem.bind(this, 'clientIdentity', it.clientIdentity)}>
                            <Sradio checked={it.clientIdentity === clientIdentity}><span className={styles.radiotext}>{it.cardNumber}<Sicon className={styles.cardSicon} icon={initCardIocn(it.brand)} /></span></Sradio>
                        </li>
                    })}
                    {bindCards && bindCards.length > 3 && <li className={styles.more} onClick={this.changeInitCardsItem.bind(this, 'isMore', !isMore)}><Sicon icon={isMore ? 'shang' : 'xia'} /></li>}
                </ul>
            </TabPane>
            <TabPane tab={t('paymentMethod.UseNewCard')} key="new">
                {this.render_gate_way(item)}
            </TabPane>
        </Tabs>
    }
    onRadioChange = (clientIdentity) => {
        let { gateWayIndex, initCards } = this.state;
        initCards[gateWayIndex].clientIdentity = clientIdentity;
        this.setState({ initCards });
    }
    /**
     * 修改initCards的item项的某值
     * @param type 修改的字段名称
     * @param val 修改后的值
     */
    changeInitCardsItem = (type, val) => {
        let { gateWayIndex, initCards } = this.state;
        initCards[gateWayIndex][type] = val;
        this.setState({ initCards });
    }
    render_gate_way = (item = {}) => {
        const { t, parentState, theme, currentLng } = this.props;
        const { formData, originKeys, gatewayCountryLoading = false } = parentState;
        switch (item.payMethod) {
            case 'Adyen':
                return <Adyen theme={theme} isLoading={gatewayCountryLoading} ref='credit' publicKey={item.publicKey} t={t} formData={formData} />;
            case 'Klarna':
                return <Klarna theme={theme} isLoading={gatewayCountryLoading} ref={item.payGateWay} parentState={parentState} formData={formData} t={t} />
            default:
                return <CreditCard gate_way_item={item} theme={theme} isLoading={gatewayCountryLoading} ref={item.payGateWay} formData={formData} t={t} />
        }
    }
    init_apple_pay_stripe = async (data,initCards) => {
        let isShowPay = await AppleGooglePay(data);
        if (isShowPay) {
            initCards.forEach(item => {
                if (item.payGateWay === 'apple_pay'&&item.payMethod === 'Stripe') {
                    item.isHide = false;
                }
            });
            this.setState({ initCards });
        } else {
            const { parentState } = this.props;
            const { formData } = parentState;
            const { payment_gate_way,payment_method } = formData;
            if (payment_gate_way === 'apple_pay'&&payment_method === 'Stripe') {//如果原本选中的是apple_pay，就修改为第一个没有被隐藏的项
                let onpayment = (initCards.find(item => !item.isHide&&(data?.payName !== item.payName)) || {});//查找第一个没有被隐藏的项
                this.onChange(onpayment)
            }
        }
    }
    init_apple_pay = async (data,initCards) => {
        let isShowPay = ApplePay.HasApplePay();
        if (isShowPay) {
            initCards.forEach(item => {
                if (item.payGateWay === 'apple_pay'&&item.payMethod !== 'Stripe') {
                    item.isHide = false;
                }
            });
            this.setState({ initCards });
        } else {
            const { parentState } = this.props;
            const { formData } = parentState;
            const { payment_gate_way, payment_method} = formData;
            if (payment_gate_way === 'apple_pay'&&payment_method !== 'Stripe') {//如果原本选中的是apple_pay，就修改为其他的第一个没有被隐藏的项
                let onpayment = (initCards.find(item => !item.isHide&&(data?.payName !== item.payName)) || {});//查找第一个没有被隐藏的项
                this.onChange(onpayment)
            }
        }
    }
    
    theChange = (type, val = '') => {
        const { extra_data } = this.state;
        extra_data[type] = val || ''
        this.setState({ extra_data })
    }
    ebanxMain = (ite) => {//ebanx时候的main显示
        let { t, parentState, theme } = this.props;
        let { bank_list, extra_list, extra_data } = this.state;
        const { formData } = parentState;
        const { country = '' } = formData || {};
        let country_code = country?.toLocaleLowerCase();
        return <div className={classNames(styles.textMain, styles.EbanxMain)}>
            {ite.payGateWay === 'pse' && <div>{extra_list.map(item => {
                return <Sselect theme={theme} id={item.name} option={bank_list} value={extra_data[item.name]} verify={item.verify} item={item} key={item.name} placeholder={item.placeholder} onChange={this.theChange.bind(this, item.name)} />
            })}</div>}
            <div>
                <span><a href={`https://www.ebanx.com/${country_code || 'mx'}/condiciones`} rel="noopener noreferrer" target="_blank">{t('paymentMethod.creditCard.EbanxMainAll')}</a></span>
                <span className={styles.imgBox}> <img src="https://bromelia.ebanx.com/tectonics/fbb3f6e8bd4ddb3432b58440fd3a8fee.svg" alt="EBANX" /></span>
            </div>
        </div>
    }
    textMain = (item) => {//显示类
        let { t } = this.props;
        const main_box = (text) => <div className={styles.textMain}>
            <Sicon className={styles.page_icon} icon='page' />
            {text}
        </div>;
        let type = (item.payMethod === 'AfterPay' ? 'AfterPay' : item.payGateWay);
        switch (type) {
            case 'fast_pay_pal':
                return main_box(<div>
                    <div className={styles.text}>{t('paymentMethod.paypal.descriptionPP1')}</div>
                    <div className={styles.text} style={{ color: '#888' }}>{t('paymentMethod.paypal.descriptionPP2')}</div>
                </div>);
            case 'pay_pal_credit':
                return main_box(<span className={styles.text}>{t('paymentMethod.paypal.description')}</span>);
            case 'AfterPay':
                return <div id="afterpay-widget-container"></div>
            // return main_box(<div>
            //     <div className={styles.text}>{t('paymentMethod.afterpay_au.descriptionPP1')}</div>
            //     <div className={styles.text} style={{ color: '#888' }}>{t('paymentMethod.afterpay_au.descriptionPP2')}</div>
            // </div>);
            default: return null
        }
    }
    pushRef = (_this) => {
        this.billingRef = _this;
    }
    hasCheckout = (payGateWay) => {
        // 判断是否需要重新渲染
        const { initCards = [], credits = [] } = this.state;
        // 判断是否存在导致需要重新渲染的项目
        let hasCheck = initCards && initCards.find(item => item.payGateWay === 'mada_credit');
        if (hasCheck && (credits.includes(payGateWay))) {
            return true
        } else { return false }
    }
    handleRememberCard = () => {
        let { initCards, gateWayIndex } = this.state;
        initCards[gateWayIndex].isAgreeBind = !initCards[gateWayIndex].isAgreeBind;
        this.setState({ initCards });
    }
    renderinitMain = (item) => {
        let { shop = {} } = window.shopify_checkouts || {};
        let { platform_name } = shop;
        const { t, parentState, theme } = this.props;
        const { formData } = parentState;
        const { payment_gate_way } = formData;
        const { credits = [], initCards = [], gateWayIndex } = this.state;
        // const { payMethod = '' } = item;
        // const { tabsActive='new', isAgreeBind = false } = initCards[gateWayIndex]||{};
        return <>
            {this.initMain(item)}
            {credits.includes(payment_gate_way) && <div className={styles.billingAddress}>
                {/* 暂时屏蔽绑卡 */}
                {/* {tabsActive === 'new' && platform_name !== "SHOPIFY" && payMethod === 'Checkout' && <div className={styles.rememberCard}><Scheckbox checked={isAgreeBind} onChange={this.handleRememberCard} >{t('paymentMethod.RememberCard')}</Scheckbox></div>} */}
                <div className={styles.textGray}><BillingAddress billingRef={this.pushRef} theme={theme} t={t} ref="BillingAddress" parentState={parentState} /></div>
            </div>}</>
    }
    render(props, state) {
        const { t, parentState, theme, style, isMobile } = this.props;
        const { initCards = [] } = this.state;
        const { formData, gatewayCountryLoading } = parentState;
        const { payName } = formData;
        return <ul className={classNames(styles.collapse)} style={style}>
            {gatewayCountryLoading ? <SkeletonCard isMobile={isMobile} /> : initCards.map((item, index) => {
                let isActive = (payName === item.payName);
                return item.isHide ? null : <li key={`${item.payMethod}-${item.payGateWay}`} className={classNames(isActive && styles.bgColor)}>
                <div className={styles[theme]}>
                    <div className={classNames(styles.cardBox)}>
                        <CreditTitle subhead={item.subhead} item={item} onClick={this.onChange.bind(this, item, index)} direction='column' theme={theme} hasRadio={true} isActive={isActive} icon={item.icon} t={t} title={item.label} formData={formData} />
                        <div className={classNames(styles.collapseTMain, !isActive && styles.hidden)}>
                            {this.renderinitMain(item)}
                        </div>
                    </div>
                </div>
            </li>;
            })}
        </ul>
    }
}

export default Index;