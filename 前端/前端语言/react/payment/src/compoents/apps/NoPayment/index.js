/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import styles from './style.module.scss';
const onPaymentIcon = require('@/assets/onPaymentIcon.png');
class Index extends Component {
    constructor({ t, i18n }) {
        super();
        this.state = {
        };
    }
    render(props, state) {
        let { shop = {} } = window.shopify_checkouts || {};
        const { t, onClick } = this.props;
        return <div className={styles.NoPayment} onClick={onClick}>
            <img src={onPaymentIcon} alt="onPaymentIcon" />
            <div>{t('paymentMethod.noPaymentMethod')}</div>
        </div>;
    }
}

export default withTranslation()(Index);