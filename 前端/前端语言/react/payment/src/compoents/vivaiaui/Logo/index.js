/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import classNames from 'classnames';
import styles from './style.module.scss';
import {Navigator} from "../index"
class Index extends Component {
    constructor({ t, i18n }) {
        super();
        this.state = {
        };
    }
    rendertext = () => {
        let { shop = {} } = window.shopify_checkouts || {};
        let { domain = '', logo } = shop;

        const { imgSite } = this.props;
        if (logo) {
            return <div className={styles.imgBox} style={imgSite ? { textAlign: imgSite } : {}}><img src={logo} alt="logo" /></div>
        } else {
            let arr = (domain && domain.split('.')) || [];
            let logoText = arr[0];
            if (logoText === 'www' || logoText.includes('http')) {
                logoText = arr[1]
            }
            return <div className={classNames(styles.imgBox,styles.text)}>{logoText}</div>
        }
    }
    render(props, state) {
        const { t, onClick, parentState, className, style } = this.props;
        return (<div style={style} className={classNames(styles.headerAd, className)}>
            {this.rendertext()}
            <div className={styles.nav}><Navigator/></div>
        </div>)
    }
}

export default withTranslation()(Index);