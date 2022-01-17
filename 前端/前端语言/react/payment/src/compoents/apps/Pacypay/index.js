/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import { Scheckbox, Sinput, Sselect, Sradio } from '../../index';
import { CreditTitle, CreditCard, Ebanx } from "../index"
import { funverify, rule } from "../../../utils"
import styles from './style.module.scss';
class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
            payList: [
                { title: t('paymentMethod.Sofortbanking'), value: 'sofort' },
                { title: 'Giropay', value: 'giropay' },
            ],
            // payList:{
            //     sofort:{title: 'Sofortbanking'},
            //     giropay:{title: 'Giropay'},
            // },
            formEbanx: [
                { name: 'email', type: 'input', types: 'email', placeholder: t('contactInfo.emailOrPhone'), verify: [{ required: true }, { pattern: rule.email, message: 'error email' }], isHide: true },
                { name: 'cpf', type: 'input', isHide: false, maxLength: 20, verify: [{ required: false }, { pattern: /\w{8,9}$/, message: 'El documento informado es inválido' }] },
            ],
            ebanxData: { cpf: '', email: '' },
        };
    }
    componentDidMount() {
        this.props.onRef && this.props.onRef(this)
    }
    setData = (type, data) => {
        let { ebanxData, formEbanx } = this.state;
        const { parentState } = this.props;
        const { formData } = parentState;
        formEbanx.forEach((item, index) => {//eslint-disable-line
            if (item.name === 'email') {
                item.isHide = false;
                item.error = true;
                item.message = data.message;
                // item.message='¡Ojo! El país desde el cual realizas tu pago debe corresponder al país donde resides.';
                ebanxData.email = ebanxData.email || formData.email || ''
            }
        });
        this.setState({ ebanxData, formEbanx });
    }
    setCardholder_name = (formData) => {//用户外部修改Shipping address触发
        this.refs.credit_card && this.refs.credit_card.setCardholder_name && this.refs.credit_card.setCardholder_name(formData);
    }
    getCreditCardData = async (callback) => {
        const { parentState } = this.props;
        const { formData } = parentState;
        const { payment_gate_way } = formData || {};// eslint-disable-line

        let isOk = true;
        let finalData = {}, cardData={};//最终参数
        await this.refs.credit && this.refs.credit.getCreditCardData((data) => {
            cardData = data;
            isOk = !!data;
        });
        if (isOk) {//如果验证都通过了,就输出参数
            finalData = Object.assign(finalData, { payment_method: 'PacyPay' },cardData);
            callback && callback(finalData)
            return finalData;
        } else {
            callback && callback();
            return
        }
    }
    initCart = (payList = []) => {
        let { order = {} } = window.shopify_checkouts || {};
        let { currency='' } = order || {};
        const { parentState } = this.props;//theme，组题，默认为空，有angle
        const { formData } = parentState;
        const { country='' } = formData || {};// eslint-disable-line
        let arr = [];
        let sofort_country = ['AT', 'BE', 'FR', 'DE', 'IT', 'NL', 'PL', 'SK', 'ES', 'CH', 'GB'];//sofort包含的国家
        let giropay_country = ['DE'];//giropay包含的国家
        let sofort_currency = ['EUR', 'GBP'];//指定货币才显示该种支付
        let giropay_currency = ['EUR'];
        payList.forEach(item => {
            if (item.value === 'sofort') {
                sofort_currency.includes(currency) && sofort_country.includes(country) && arr.push(item);
            } else if (item.value === 'giropay') {
                giropay_currency.includes(currency)&& giropay_country.includes(country) && arr.push(item);
            }
        });
        return arr
    }
    render(props, state) {
        const { t, onChange, parentState, theme } = this.props;//theme，组题，默认为空，有angle
        const { payList = [] } = this.state;
        const {  formData } = parentState;
        const { payment_gate_way } = formData || {};// eslint-disable-line
        return <div>
            <ul className={classNames(styles.collapse, theme && styles[theme])}>
                <li className={(payment_gate_way === 'credit') && styles.bgColor}>
                    <div className={classNames(styles.cardBox)}>
                        <CreditTitle direction='column' theme={theme} formData={formData} onClick={() => { onChange && onChange('payment_gate_way', 'credit') }} hasRadio={true} isActive={payment_gate_way === 'credit'} t={t} title={t('paymentMethod.creditCard.label')} icon={'PacyPay_credit'} />
                        <div className={classNames(styles.collapseTMain, payment_gate_way !== 'credit' && styles.hidden)}>
                            <CreditCard theme={theme} ref='credit' payment_gate_way={payment_gate_way} formData={formData} t={t} />
                        </div>
                    </div>
                </li>
                {/* {this.initCart(payList).length > 0 && this.initCart(payList).map(item => {
                    return <li key={item.value}>
                        <div>
                            <CreditTitle direction={item.direction} theme={theme} onClick={() => { onChange && onChange('payment_method', item.value) }} hasRadio={true} isActive={isActive(item)} t={t} title={item.title} icon={item.value} />
                        </div>
                    </li>
                })} */}
            </ul>
        </div>
    }
}

export default Index;