/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import { Scheckbox, Sinput, Sselect, Sradio } from '../../../index';
import { CreditTitle, CreditCard, Ebanx } from "../../index"
import { funverify, rule } from "../../../../utils"
import styles from './style.module.scss';
class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
            formEbanx: [
                { name: 'email', type: 'input', types: 'email', placeholder: t('contactInfo.emailOrPhone'), verify: [{ required: true }, { pattern: rule.email, message: 'error email' }], isHide: true },
                // { name: 'cpf', type: 'input', isHide: false, maxLength: 20, verify: [{ required: false }, { pattern: /\w{8,9}$/, message: 'El documento informado es inválido' }] },
            ],
            ebanxData: { email: '' },
        };
    }
    componentDidMount() {
        this.initData()
    }
    initData = () => {
        //初始化回填数据
    }
    setData = async (type, data) => {
        let { ebanxData, formEbanx } = this.state;
        const { parentState } = this.props;
        const { formData } = parentState;
        const { payment_gate_way } = formData || {};// eslint-disable-line
        if (payment_gate_way === 'credit') {
            await this.refs[payment_gate_way] && this.refs[payment_gate_way].setData(type, data);
        } else {
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
    }
    setCardholder_name = (formData) => {//用户外部修改Shipping address触发
        this.refs.credit && this.refs.credit.setCardholder_name && this.refs.credit.setCardholder_name(formData);
    }
    getCreditCardData = async (callback) => {
        const { parentState } = this.props;
        const { formData } = parentState;
        const { payment_gate_way } = formData;

        let isOk = true;
        let finalData = {}, cardData = {};//最终参数
        await this.refs[payment_gate_way] && this.refs[payment_gate_way].getCreditCardData((data) => {
            cardData = data;
            isOk = !!data;
        });
        if (isOk) {//如果验证都通过了,就输出参数
            finalData = Object.assign(finalData, { payment_method: 'Ebanx' }, cardData);
            callback && callback(finalData)
            return finalData;
        } else {
            callback && callback();
            return
        }
    }
    render(props, state) {
        const { t, onChange, parentState, theme } = this.props;//theme，组题，默认为空，有angle
        const { formData } = parentState;
        const { payment_gate_way } = formData || {};// eslint-disable-line
        return <ul className={classNames(styles.collapse, theme && styles[theme])}>
            <li className={classNames((payment_gate_way === 'credit') && styles.bgColor)}>
                <div className={classNames(styles.cardBox)}>
                    <CreditTitle direction='column' theme={theme} formData={formData} onClick={() => { onChange && onChange('payment_gate_way', 'credit') }} hasRadio={true} isActive={payment_gate_way === 'credit'} t={t} title={t('paymentMethod.creditCard.label')} icon={'Ebanx_credit'} />
                    <div className={classNames(styles.collapseTMain, payment_gate_way !== 'credit' && styles.hidden)}>
                        <CreditCard theme={theme} ref='credit' formData={formData} t={t} />
                    </div>
                </div>
            </li>
            <li onClick={() => { onChange && onChange('payment_gate_way', 'oxxo') }} className={classNames((payment_gate_way === 'oxxo') && styles.bgColor)}>
                <div className={classNames(styles.cardBox)}>
                    <Ebanx theme={theme} formData={formData} hasRadio={true} ref='oxxo' isActive={payment_gate_way === 'oxxo'} t={t} title={t('paymentMethod.creditCard.OXXOEBANX')} icon={'oxxo'} />
                </div>
            </li>
            <li onClick={() => { onChange && onChange('payment_gate_way', 'spei') }} className={classNames((payment_gate_way === 'spei') && styles.bgColor)}>
                <div className={classNames(styles.cardBox)}>
                    <Ebanx theme={theme} formData={formData} hasRadio={true} ref='spei' isActive={payment_gate_way === 'spei'} t={t} title={t('paymentMethod.creditCard.SPEIEBANX')} icon={'spei'} />
                </div>
            </li>
        </ul>
    }
}

export default Index;