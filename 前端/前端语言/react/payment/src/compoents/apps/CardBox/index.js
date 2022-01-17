/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import { CreditCard, Adyen, Oceanpayment, CreditTitle } from "../index"
import styles from './style.module.scss';
class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
        };
    }
    setData = (type, data) => {
        this.refs.child_ref.setData && this.refs.child_ref.setData(type, data);
    }
    initCountry = (data = {}) => {
        this.refs.child_ref && this.refs.child_ref.initCountry(data);
    }
    getCreditCardData = async (callback) => {//验证是否合格
        await this.refs.child_ref && this.refs.child_ref.getCreditCardData(callback);
    }
    renderForm = (callback) => {
        this.refs.child_ref && this.refs.child_ref.renderForm(callback);
    }
    setCardholder_name = (formData) => {//用户外部修改Shipping address触发
        this.refs.child_ref && this.refs.child_ref.setCardholder_name(formData);
    }
    render_gate_way = (payment_method) => {
        const { t, parentState, theme } = this.props;
        const { formData, originKeys={}, gatewayCountryLoading = false, } = parentState;
        switch (payment_method) {
            case 'Adyen':
                return <Adyen theme={theme} isLoading={gatewayCountryLoading} ref='child_ref' publicKey={originKeys.adyenOriginKey} t={t} formData={formData} />;
            case 'Ocean':
                return <Oceanpayment isLoading={gatewayCountryLoading} ref='child_ref' formData={formData} t={t} originKeys={originKeys} />
            default:
                return <CreditCard theme={theme} isLoading={gatewayCountryLoading} ref='child_ref' formData={formData} t={t} />
        }
    }
    onChange=()=>{
        const { parentState,onChange} = this.props;
        const { formData } = parentState;
        const { payment_gate_way} = formData;
        if(payment_gate_way !== 'credit'){
            onChange&&onChange('payment_gate_way', 'credit');
        }
    }
    render(props, state) {
        const { t, parentState, theme } = this.props;
        const { formData } = parentState;
        const { payment_gate_way, payment_method } = formData;
        let isActive = payment_gate_way === 'credit';
        return <ul className={classNames(styles.collapse, styles[theme])}>
            <li>
                <div className={classNames(styles[theme], isActive && styles.bgColor)}>
                    <div className={classNames(styles.cardBox)}>
                        <CreditTitle onClick={() => this.onChange()} direction='column' theme={theme} hasRadio={true} isActive={isActive} icon={`${payment_method}_credit`} t={t} title={t('paymentMethod.creditCard.label')} formData={formData} />
                        <div className={classNames(styles.collapseTMain, payment_gate_way !== 'credit' && styles.hidden)}>
                            {this.render_gate_way(payment_method)}
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    }
}

export default Index;