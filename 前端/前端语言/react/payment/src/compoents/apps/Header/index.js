/*
 * @Author: yangj
 * @Date: 2021-12-23 09:15:11
 * @LastEditors: yangj
 */

import React, { Component } from "react";
import styles from './style.module.scss';
import classNames from 'classnames';
import { withTranslation } from "react-i18next";
import { Logo } from "../index"
import { Stips, Sicon, Smodal } from '../../index';
import { gtmTrigger } from "../../../utils"
const { shop = {} } = window.shopify_checkouts || {};
const IS_JP = shop.name==="vivaiacollection_jp";
class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
            visible: false
        }
    }
    // returnLink = (e) => {
    //     let evt = e || window.event; //获取event对象
    //     let { shop = {}, order = {} } = window.shopify_checkouts || {};
    //     let { domain = '', mobile_url = '', platform_name } = shop;
    //     let { language = '' } = order;
    //     if (evt.preventDefault) {
    //         evt.preventDefault();
    //     } else {
    //         evt.returnValue = false;
    //     }
    //     gtmTrigger({ eventAction: "return_previous_", eventLabel: "cancel" });
    //     if (parentState.page === 1) {
    //         history.go(-1);
    //         location.hash = '';
    //     } else {
    //         if (mobile_url) {
    //             if (platform_name === 'MIDDLEEAST') {
    //                 // location.href = `${mobile_url}${language ? `/${language.toLowerCase()}` : ''}`;
    //                 location.href = mobile_url;
    //             } else {
    //                 location.href = mobile_url ? mobile_url : (domain ? `https://user.${domain.replace("www.", "")}/mod-users.htm` : '/');
    //             }
    //         } else {
    //             history.go(-1);
    //             location.hash = '';
    //         }
    //     }
    // }
    onClick = () => {
        const { callback } = this.props;
        console.log('onClick',this.props);
        if(callback&&!IS_JP){return callback()};
        this.setState({ visible: true });
    }
    onCancel = () => {
        this.setState({ visible: false });
        gtmTrigger({ eventAction: "payment_action", eventLabel: "payment" });
    }
    
  //目前只有日本站才会触发这个
  SmodalCancel=()=>{
    const { SmodalCancel,callback } = this.props;
    console.log('SmodalCancel',this.props);
    if(SmodalCancel){
        gtmTrigger({eventAction: 'payment_action',eventLabel: "back_button" });
        SmodalCancel();
    }else{
        callback&&callback()
    }
  }
    render() {
        let { t = {}, backText,callback } = this.props;
        let { order = {} } = window.shopify_checkouts || {};
        let { language } = order || {}
        let { visible } = this.state;
        backText = backText || `${t('BackToOrder')}`
        return (
            <div className={styles.top}>
                <div className={styles.back} onClick={this.onClick}><Sicon style={language === 'ar' ? { transform: 'rotateY(180deg)' } : {}} icon='fanhui' /> {backText}</div>
                <Smodal visible={visible} type='confirm' onOk={this.onCancel} onCancel={this.SmodalCancel} cancelText={IS_JP?'はい':undefined} okText={IS_JP?'いいえ':t('CONTINUE')}>{t('isBack')}</Smodal>
            </div>
        );
    }
}

export default withTranslation()(Index);