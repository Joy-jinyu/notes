
import React, { Component } from "react";
import styles from './style.module.scss';
import classNames from 'classnames';
import { withTranslation } from "react-i18next";
import { Sicon, Smodal } from "../index"
import { Logo } from "../apps"
import { gtmTrigger } from "../../utils"
const { shop = {} } = window.shopify_checkouts || {};
const IS_JP = shop.name==='vivaiacollection_jp';
class Index extends Component {
  constructor({ t }) {
    super();
    this.state = {
      visible: false
    }
  }
  rendertext = () => {
    const { t = {}, title, onClick } = this.props;
    //ZAFUL Order Payment
    // let { shop = {} } = window.shopify_checkouts || {};
    // let { domain = '' } = shop;
    // let arr = (domain && domain.split('.')) || [];
    // let logoText = arr[0];
    // if (logoText === 'www') {
    //   logoText = arr[1]
    // }
    // logoText = logoText.toUpperCase() || '';
    // logoText && (logoText = `${logoText} ${t('OrderPayment')}`);
    return title || t('SecureCheckout')//logoText
  }
  onClick = () => {
    const { onClick } = this.props;
    if(onClick&&!IS_JP){return onClick()};
    this.setState({ visible: true });
  }
  onCancel = () => {
    this.setState({ visible: false });
    gtmTrigger({ eventAction: "return_previous_", eventLabel: "payment" });
  }
  //目前只有日本站才会触发这个
  SmodalCancel=()=>{
    const { SmodalCancel,onClick } = this.props;
    if(SmodalCancel){
        gtmTrigger({ eventLabel: "back_button" });
        SmodalCancel();
    }else{
        onClick&&onClick()
    }
  }
  render() {
    const { t = {}, title, onClick, children } = this.props;
    let { visible } = this.state
    let { shop = {} } = window.shopify_checkouts || {};
    let { platform_name } = shop || {};
    return (
      <div>
          {/* 注意：他们新旧中东页头目前样式不一样 */}
        {(platform_name === 'SOULMIA'||platform_name === 'MIDDLEEAST') ? <div className={styles.m_page_title}>
          <span>{this.rendertext()}</span>
          <span className={classNames(styles.back_btn)} onClick={this.onClick}>
            <Sicon icon='fanhui_long' />{children}
          </span>
        </div > : <div className={styles.m_page_title}>
            <Logo />
            <span className={classNames(styles.back_btn, styles.positionRight)} onClick={this.onClick}>
              <Sicon icon='gerenzhongxin' />
            </span>
          </div >}
        <Smodal visible={visible} type='confirm' onOk={this.onCancel} onCancel={this.SmodalCancel} cancelText={IS_JP?'はい':undefined} okText={IS_JP?'いいえ':t('CONTINUE')}>{t('isBack')}</Smodal>
      </div>
    );
  }
}

export default withTranslation()(Index);