/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import { Scheckbox, Sinput, Sselect, Sradio } from '../../../index';
import { CreditTitle, CreditCard } from "../../index"
import { funverify, rule } from "../../../../utils"
import styles from './style.module.scss';
class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
            webpayList: [{ title: 'Webpay', value: 'webpay', direction: 'column' }],
            payList: [
                { title: 'Multicaja', value: 'multicaja' },
                { title: 'Sencillito', value: 'sencillito' },
                { title: 'ServiPag', value: 'servipag' },
            ],
            formEbanx: [
                { name: 'email', type: 'input', types: 'email', placeholder: t('contactInfo.emailOrPhone'), verify: [{ required: true }, { pattern: rule.email, message: 'error email' }], isHide: true },
                // { name: 'cpf', type: 'input', isHide: false, maxLength: 12, verify: [{ required: true }, { pattern: /\w{8,9}$/, message: 'El documento informado es inválido' }] },
            ],
            ebanxData: { email: '' },
        };
    }
    componentDidMount() {
        // this.props.onRef&&this.props.onRef(this)
        this.initData()
    }
    initData = () => {
        //初始化回填数据
    }
    setData = async (type, data) => {
        let { ebanxData, formEbanx, } = this.state;
        const { parentState } = this.props;
        const { formData } = parentState;
        if (formData.payment_gate_way === 'credit') {
            await this.refs.credit && this.refs.credit.setData(type, data);
        } else {
            formEbanx.forEach((item, index) => {//eslint-disable-line
                if (item.name === 'email') {
                    item.isHide = false;
                    item.error = true;
                    item.message = data.message;
                    ebanxData.email = ebanxData.email || formData.email || ''
                }
            });
            this.setState({ ebanxData, formEbanx });
        }
    }
    getCreditCardData = async (callback) => {
        const { parentState } = this.props;
        const { formData } = parentState;
        const { payment_gate_way } = formData || {};// eslint-disable-line
        let { ebanxData = {}, formEbanx = [] } = this.state;

        let isOk = true;
        let finalData = {}, cardData;//最终参数
        await this.refs[payment_gate_way] && this.refs[payment_gate_way].getCreditCardData((data) => {
            cardData = data;
            isOk = !!data;
        });
        if (payment_gate_way !== 'credit') {
            for (let key in ebanxData) {
                let value = ebanxData[key] || '';
                formEbanx.forEach((item, index) => {//eslint-disable-line
                    if (item.isHide) {
                        item.error = false;
                    } else {
                        (item.name === key) && funverify({ value, verify: item.verify, item, scroll: true });
                    }
                    (item.error === true) && (isOk = false);
                })
            };
        }
        this.setState({ formEbanx });
        if (isOk) {//如果验证都通过了,就输出参数
            finalData = Object.assign(finalData, { payment_method: 'Ebanx' }, cardData);
            if (payment_gate_way !== 'credit') {
                finalData.email = ebanxData.email || ''
            }
            if (!finalData.email) {
                delete finalData.email
            }
            callback && callback(finalData)
            return finalData;
        } else {
            callback && callback()
            return
        }
    }
    sinputChange = (type, val) => {
        // console.log('ew', type, val);
        let { ebanxData = {} } = this.state;
        ebanxData[type] = val || '';
        this.setState({ ebanxData });
    }
    render(props, state) {
        const { t, parentState, onChange, theme } = this.props;
        const { formData } = parentState;
        const { payList = [], webpayList = [], ebanxData = {}, formEbanx = [] } = this.state;
        const { payment_gate_way } = formData || {};// eslint-disable-line
        let isActive = (item) => (payment_gate_way === item.value)
        return <ul className={classNames(styles.collapse, theme && styles[theme])}>
            {webpayList.map(item => {
                return <li key={item.value} className={isActive(item) && styles.bgColor}>
                    <div className={classNames(styles.cardBox)}>
                        <CreditTitle direction={item.direction} theme={theme} onClick={() => { onChange && onChange('payment_gate_way', item.value) }} hasRadio={true} isActive={isActive(item)} t={t} title={item.title} icon={item.value} />
                        <div className={classNames(styles.collapseTMain, !isActive(item) && styles.hidden)}>
                            <div className={classNames(styles.inputBox)}>
                                {formEbanx.map(item => {
                                    if (item.type === 'input' && !item.isHide) {
                                        return <div className={styles.inputParent} key={item.name}>
                                            <Sinput disabled={item.disabled} theme={theme} maxLength={item.maxLength} onChange={this.sinputChange.bind(this, item.name)} type={item.types} value={ebanxData[item.name]} placeholder={item.placeholder} verify={item.verify} item={item} />
                                        </div>
                                    } else {
                                        return null
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </li>
            })}
            <li className={(payment_gate_way === 'credit') && styles.bgColor}>
                <div className={classNames(styles.cardBox)}>
                    <CreditTitle direction='column' theme={theme} formData={formData} onClick={() => { onChange && onChange('payment_gate_way', 'credit') }} hasRadio={true} isActive={payment_gate_way === 'credit'} t={t} title={t('paymentMethod.creditCard.label')} icon={'Ebanx_credit'} />
                    <div className={classNames(styles.collapseTMain, payment_gate_way !== 'credit' && styles.hidden)}>
                        <CreditCard theme={theme} ref='credit' formData={formData} t={t} />
                    </div>
                </div>
            </li>
            {payList.map(item => {
                return <li key={item.value} className={isActive(item) && styles.bgColor}>
                    <div className={classNames(styles.cardBox)}>
                        <CreditTitle direction={item.direction} theme={theme} onClick={() => { onChange && onChange('payment_gate_way', item.value) }} hasRadio={true} isActive={isActive(item)} t={t} title={item.title} icon={item.value} />
                        <div className={classNames(styles.collapseTMain, !isActive(item) && styles.hidden)}>
                            <div className={classNames(styles.inputBox)}>
                                {formEbanx.map(item => {
                                    if (item.type === 'input' && !item.isHide) {
                                        return <div className={styles.inputParent} key={item.name}>
                                            <Sinput disabled={item.disabled} theme={theme} maxLength={item.maxLength} onChange={this.sinputChange.bind(this, item.name)} type={item.types} value={ebanxData[item.name]} placeholder={item.placeholder} verify={item.verify} item={item} />
                                        </div>
                                    } else {
                                        return null
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </li>
            })}
        </ul>
    }
}

export default Index;