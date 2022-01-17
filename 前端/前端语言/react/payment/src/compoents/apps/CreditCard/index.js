/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import { Scheckbox, Sinput, SboxList, Sradio } from '../../index';
import { PaymentInputsWrapper } from "../index"
import { funverify, rule, currencySequence } from "../../../utils"
import Pubsub from "../../../utils/pubsub";
import styles from './style.module.scss';
let { shop = {} } = window.shopify_checkouts || {};
let { platform_name } = shop || {};
let showArr = ['HARBOR', 'SHOPIFY'];
let showCardName = showArr.includes(platform_name);
class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
            datas: { card_number: '', expiry: '', cvc: '', cardholder_name: '' },
            formEbanx: [
                { name: 'email', type: 'input', types: 'email', placeholder: t('contactInfo.emailOrPhone'), verify: [{ required: true }, { pattern: rule.email, message: 'error email' }], isHide: true },
                // { name: 'cpf', type: 'input', isHide: false,maxLength:14, verify: [{ required: true}] },
                { name: 'streetNumber', type: 'input', types: 'number', placeholder: t('paymentMethod.creditCard.streetNumber'), verify: [{ required: true }], isHide: true },
            ],
            formItem: [
                { name: 'card_number', type: 'paymentCard', placeholder: t('paymentMethod.creditCard.cardNumber'), verify: [{ required: true }] },
                { name: 'expiry', type: 'no', placeholder: '', verify: [{ required: true }] },
                { name: 'cvc', type: 'no', placeholder: '', verify: [{ required: true }] },
                { name: 'cardholder_name', type: 'formDataInput', isHide: !showCardName, placeholder: t('paymentMethod.creditCard.cardHolderName'), verify: [{ required: true }] },
                { name: 'instalments', type: 'SboxList', placeholder: t('paymentMethod.creditCard.PayInInstallments'), verify: [{ required: true }], isHide: true },
            ],
            ebanxData: { streetNumber: '', email: '' },
            formItme: [],//实际使用的form
            gate_way_item: {},
            credits: ['credit', 'mada_credit'],
        };
    }
    componentDidMount() {
        this.currentLng = (document.documentElement.lang || 'en').toLocaleLowerCase();
        this.initeData();
        this.initData()
        this.initForms();
    }
    initData = () => {
        //初始化回填数据
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextState) {//
        let { gate_way_item, initCards = [] } = this.state;
        if ((JSON.stringify(nextProps.gate_way_item) !== JSON.stringify(gate_way_item))) {//目前gate_way_item仅用于判断是否有分期
            this.initForms();
        }
    }
    initCountry = (data = {}) => {
        this.refs.BillingAddress && this.refs.BillingAddress.initCountry(data);
    }

    setData = (type, data) => {
        let { ebanxData, formEbanx, } = this.state;
        const { formData } = this.props;
        formEbanx.forEach((item, index) => {//eslint-disable-line
            if (item.name === 'email') {
                item.isHide = false;
                item.error = true;
                item.message = data.message;
                // item.message='¡Ojo! El país desde el cual realizas tu pago debe corresponder al país donde resides.';
                ebanxData.email = (ebanxData.email || formData.email) || ''
            }
        });
        this.setState({ ebanxData, formEbanx });
    }
    getCreditCardData = async (callback) => {//验证是否合格
        let { datas = {}, ebanxData = {}, formEbanx = [], formItem = [],credits } = this.state;
        let { formData } = this.props;
        let { payment_gate_way } = formData;
        const isebanx = (formData.payment_method === 'Ebanx');
        this.setState({ cardFunverify: credits.includes(payment_gate_way)});//cardFunverify:是否验证
        let isOk = true;
        let finalData = {};//最终参数
        if (isebanx) {
            for (let key in ebanxData) {
                let value = ebanxData[key] || '';
                formEbanx.forEach((item, index) => {//eslint-disable-line
                    if (item.isHide) {
                        item.error = false;
                        if (item.name === 'email') {
                            ebanxData.email = undefined
                        }
                    } else {
                        (item.name === key) && funverify({ value, verify: item.verify, item, scroll: true });
                    }
                    (item.error === true) && (isOk = false);
                })
            };
            this.setState({ formEbanx });
        }
        for (let key in datas) {
            let value = ebanxData[key] || datas[key];
            formItem.forEach((item, index) => {//eslint-disable-line
                let cardArror = ['card_number', 'expiry', 'cvc'];
                if ((cardArror.includes(item.name)) && item.verify && item.verify[0] && item.verify[0].required && datas[item.name]) {//若前三项必填，且有值，那么PaymentInputsWrapper自带验证就行了
                    //todo
                } else {
                    item.isHide ? (item.error = false) : (item.name === key) && funverify({ value, verify: item.verify, item, scroll: true });
                }
                (item.error === true) && (isOk = false);
            })
        };
        this.setState({ formItem });
        if (isOk) {//如果验证都通过了,就输出参数
            if (isebanx) {
                finalData = Object.assign({}, datas, ebanxData);
                if (!finalData.email) {
                    delete finalData.email
                }
            } else {
                finalData = Object.assign({}, datas);
            }
            callback && callback(finalData);
            return finalData;
        } else {
            return callback && callback(false);
        }
    }
    initeData = () => {//重置
        let { formEbanx = [] } = this.state;
        let { formData = {} } = this.props;
        let { payment_gate_way } = formData;
        formEbanx.forEach(item => {
            item.verify = (item.verify ? item.verify : [{ required: false }]);
            item.verify.map(e => {
                e.required = (payment_gate_way === 'credit');
                return true
            })
        });
        this.setCardholder_name(formData);
        this.setState({ formEbanx });
    }
    paymentInputsWrapperOnError = (erroredInputs) => {
        const { formData } = this.props;
        let { payment_gate_way } = formData;
        const { formItem = [],credits } = this.state;
        if (credits.includes(payment_gate_way)) {
            formItem[0].error = (!!erroredInputs.cardNumber);
            formItem[1].error = (!!erroredInputs.expiryDate);
            formItem[2].error = (!!erroredInputs.cvc);
        } else {
            formItem[0].error = false;
            formItem[1].error = false;
            formItem[2].error = false;
        }
        this.setState({ formItem })
    }
    initCardError = (e) => {
        const { formItem = [] } = this.state;
        let isError = false;
        for (let i = 0; i < formItem.length - 1; i++) {//最后一项cardholder_name不属于信用卡组件
            formItem[i].error && (isError = true);
        }
        return isError
    }
    ebanxDataChange = (type, val) => {
        let { ebanxData = {} } = this.state;
        ebanxData[type] = val || '';
        this.setState({ ebanxData })
    }
    setCardholder_name = (formData) => {//用户外部修改Shipping address触发
        let cardholder_name = `${formData.first_name || ''} ${formData.last_name || ''}`;
        cardholder_name && (cardholder_name = cardholder_name.trim());
        this.sinputChange('cardholder_name', cardholder_name);
    }
    sinputChange = (type, val, name, item) => {
        let { datas = {} } = this.state;
        datas[type] = val;
        this.setState({ datas });
        if (type === 'instalments') {//如果是修改分期
            this.setInstalmentsItem(item)
        }
    }
    initForms = () => {
        const { gate_way_item, t, formData } = this.props;
        let { formEbanx = [], formItem = [], datas } = this.state;
        const { payment_method } = formData || {};// eslint-disable-line
        const isebanx = (payment_method === 'Ebanx');
        let formItme = isebanx ? [...formEbanx, ...formItem] : formItem;
        const { instalments = [] } = gate_way_item || {};
        const hasArr = instalments && instalments.length;
        let instalmentsItem = formItme.find(item => item.name === 'instalments');
        let arr = [];
        if (hasArr) {//如果有分期
            instalments.forEach(item => {
                let { periodNumber, periodAmount, customerInterestRate } = item;//periodNumber：期数，periodAmount：每期价格，customerInterestRate利率
                arr.push({ ...item, code: periodNumber, name: `${periodNumber}x @ ${customerInterestRate}%`, name2: `${currencySequence(periodAmount)}/${t('paymentMethod.creditCard.Month')}` })
            });
            instalmentsItem.isHide = false;
            datas.instalments = instalments[0].periodNumber;//默认选中第一个分期
            this.setInstalmentsItem(instalments[0])
        } else {
            datas.instalments = '';//默认选中第一个分期
            instalmentsItem.isHide = true;
            this.setInstalmentsItem()
        }
        instalmentsItem.option = arr;
        this.setState({ formItme, gate_way_item, datas });
    }
    setInstalmentsItem = (item) => {
        const {formData}=this.props;
        const {credits}=this.state;
        const { payment_gate_way } = formData || {};
        if(credits.includes(payment_gate_way)){
            Pubsub.publish('instalmentsItem', item);
        }
    }
    render(props, state) {
        const { t, formData, theme } = this.props;
        let { ebanxData = {}, datas, cardFunverify, formItme = [] } = this.state;
        const { payment_method, payment_gate_way } = formData || {};// eslint-disable-line
        const { card_number, expiry, cvc } = datas || {};// eslint-disable-line
        // const isebanx = (payment_method === 'Ebanx');
        return <div className={classNames(styles.CreditCard)}>
            <div>
                {formItme.map(item => {
                    if (item.type === 'input' && !item.isHide) {
                        return <div className={styles.inputParent} key={item.name}>
                            <Sinput disabled={item.disabled} theme={theme} maxLength={item.maxLength} id={item.name} onChange={this.ebanxDataChange.bind(this, item.name)} type={item.types} value={ebanxData[item.name]} placeholder={item.placeholder} verify={item.verify} item={item} />
                        </div>
                    } else if (item.type === 'paymentCard') {
                        return <div className={styles.inputParent} key={item.name}>
                            <PaymentInputsWrapper theme={theme} t={t} onChange={this.sinputChange} placeholder={item.placeholder} card_number={card_number} expiry={expiry} cvc={cvc} cardFunverify={cardFunverify} onError={this.paymentInputsWrapperOnError} />
                        </div>
                    } else if (item.type === 'formDataInput' && !item.isHide) {
                        return <div className={styles.inputParent} key={item.name}>
                            <Sinput theme={theme} id={item.name} onChange={this.sinputChange.bind(this, item.name)} type={item.types} value={datas[item.name]} placeholder={item.placeholder} verify={item.verify} item={item} />
                        </div>
                    } else if (item.type === 'SboxList' && !item.isHide) {
                        return <div style={{ marginTop: 10, padding: '0 0.42em' }} className={styles.inputParent} key={item.name}>
                            <SboxList title={item.placeholder} theme={theme} option={item.option} id={item.name} onChange={this.sinputChange.bind(this, item.name)} value={datas[item.name]} placeholder={item.placeholder} verify={item.verify} item={item} />
                            <div className={classNames(styles.payVia)}>
                                <div>{t('paymentMethod.creditCard.payVia')}</div>
                                <img src="https://business.ebanx.com/hubfs/global_assets/logos/logo-ebanx--color.svg" alt="" />
                            </div>
                        </div>
                    } else {
                        return null
                    }
                })}
            </div>
            {/* {isebanx && <div className={classNames(styles.collapseTitle, styles.payVia)}>
                <div>{t('paymentMethod.creditCard.payVia')}</div>
                <img src="https://business.ebanx.com/hubfs/global_assets/logos/logo-ebanx--color.svg" alt="" />
            </div>} */}
            {/* <BillingAddress t={t} ref="BillingAddress" /> */}
        </div>
    }
}

export default Index;