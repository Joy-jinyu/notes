/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import { Scheckbox, Sinput, Sselect, Sradio } from '../../index';
import { CreditTitle } from "../index"
import { funverify } from "../../../utils"
import styles from './style.module.scss';
class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
        };
    }
    componentDidMount() {
    }
    getCreditCardData = async (callback) => {
        callback && callback({ payment_method: 'Ebanx' })
    }
    setCardholder_name = (formData) => {//用户外部修改Shipping address触发
    }
    render(props, state) {
        const { isActive, title, t, formData,icon,theme } = this.props;
        const { country='' } = formData || {};// eslint-disable-line.toLocaleLowerCase();
        let country_code=country.toLocaleLowerCase()
        return <div>
            <CreditTitle theme={theme} hasRadio={true} isActive={isActive} t={t} title={title} icon={icon} formData={formData}/>
            <div className={classNames(styles.collapseTMain, !isActive && styles.hidden)}>
                <div className={classNames(styles.EbanxMain)}>
                    <div>{t('paymentMethod.creditCard.EbanxMain1')} <a href={`https://www.ebanx.com/${country_code||'mx'}/condiciones`} rel="noopener noreferrer" target="_blank">{t('paymentMethod.creditCard.EbanxMain2')}</a> {t('paymentMethod.creditCard.EbanxMain3')}</div>
                    <div className={styles.imgBox}>{t('paymentMethod.creditCard.EbanxMain4')} <img src="https://bromelia.ebanx.com/tectonics/fbb3f6e8bd4ddb3432b58440fd3a8fee.svg" alt="EBANX" /></div>
                </div>
            </div>
        </div>
    }
}

export default Index;