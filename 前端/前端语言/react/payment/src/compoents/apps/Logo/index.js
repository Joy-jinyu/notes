/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import classNames from 'classnames';
import styles from './style.module.scss';
import {VIVAIA_LOGO} from '../../../utils/dadas';
// import { getChgLanguageParams } from '../../../utils/languageChg'
class Index extends Component {
    constructor({ t, i18n }) {
        super();
        this.state = {
        };
    }
    rendertext = () => {
        let { shop = {} } = window.shopify_checkouts || {};
        let { domain = '', logo,name,platform_name } = shop;
        if(name==="VIVAIA"||platform_name==="VIVAIA"){
            logo=VIVAIA_LOGO;
        }
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
    returnLink = () => {
        // let { order = {} } = window.shopify_checkouts || {};
        // const {language,order_domain} = order||{};
        // let link = window.location.origin;//payment.
        // if(order_domain){//有order_domain的情况
        //     if(order_domain.includes('http')){
        //         link=order_domain;
        //     }else{
        //         link=`${location.protocol||'https:'}${order_domain}`
        //     }
        // }
        // link = link.replace('payment.', '');
        // if (language) {
        //     location.href = `${link || '/'}${getChgLanguageParams(language, "?")}`
        // } else {
        //     location.href = link || '/'
        // }

    }
    render(props, state) {
        const { t, onClick, parentState, className, style } = this.props;
        return (<div style={style} className={classNames(styles.headerAd, className)} onClick={() => { this.returnLink() }}>{this.rendertext()}</div>)
    }
}

export default withTranslation()(Index);