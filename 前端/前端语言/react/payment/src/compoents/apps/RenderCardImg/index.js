/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import classNames from 'classnames';
import styles from './style.module.scss';
import { Sicon } from "../../index";
const qianhaiPay_icon = require('../../../assets/qianhaiPay_icon.png')
const mada_card = require('../../../assets/mada_card.png')
class Index extends Component {
    constructor({ t, i18n }) {
        super();
        this.state = {
        };
    }
    render(props, state) {
        let iconstyle = { width: '100%', height: '100%' };
        let { t, icon, formData, moreIcon, className, item = {} } = this.props;//moreIcon 是否在超过4个图标时显示省略号，默认显示
        const { brandIcons } = item || {};
        const { country } = formData || {};// eslint-disable-line
        let defaultArror = ['Adyen_credit', 'WorldPay_credit'];
        let all_credit_icon = ['Ebanx_credit', 'PacyPay_credit', 'Stripe_credit'];
        let newIcon = defaultArror.includes(icon || '') ? 'che_ad_wo' : icon;
        newIcon = (all_credit_icon.includes(newIcon || '') ? 'all_credit' : newIcon);
        let visa = <Sicon style={iconstyle} icon='visa' />
        let visa_debit = <Sicon style={iconstyle} icon='visa-debit' />;
        let master = <Sicon style={iconstyle} icon='mastercard' />;
        let maestro = <Sicon style={iconstyle} icon='maestro' />;
        let amex = <Sicon style={iconstyle} icon='amex' />;
        let jcb = <Sicon style={iconstyle} icon='jcb' />;
        let discover = <Sicon style={iconstyle} icon='discover' />;//发现卡
        let dinersclub = <Sicon style={iconstyle} icon='dinersclub' />;//大来卡
        let klarna = <Sicon style={iconstyle} icon='klarna' />;
        let giropay = <Sicon style={iconstyle} icon='giropay' />;
        let magna = <Sicon style={iconstyle} icon='magna' />;
        let multicaja = <Sicon style={iconstyle} icon='multicaja' />;
        let servipag = <Sicon style={iconstyle} icon='servipag' />;
        let sencillito = <Sicon style={iconstyle} icon='sencillito' />;
        let safetypay = <Sicon style={iconstyle} icon='safetypay' />;
        let pagoefectivo = <Sicon style={iconstyle} icon='pagoefectivo' />;
        let oxxo = <Sicon style={iconstyle} icon='oxxo' />;
        let carnet = <Sicon style={{ width: '100%', height: '97%' }} icon='carnet' />;
        let qpay = <Sicon style={iconstyle} icon='qpay' />;
        let mada = <Sicon style={iconstyle} icon='mada' />;
        let knet = <Sicon style={iconstyle} icon='knet' />;
        let spei = <Sicon style={iconstyle} icon='spei' />;
        let paypal1 = <Sicon style={iconstyle} icon='paypal1' />;
        let pse = <Sicon style={iconstyle} icon='pse' />;
        let boleto = <Sicon style={iconstyle} icon='boleto' />;
        let apple_pay = <Sicon style={{...iconstyle,height: '98%'}} icon='apple_pay' />;
        let afterpay = <Sicon style={iconstyle} icon='afterpay' />;
        let hipercard = <Sicon style={iconstyle} icon='hipercard' />;
        let elo = <Sicon style={iconstyle} icon='elo' />;
        let onicon = '';
        // newIcon='sofort'
        if (brandIcons && brandIcons.length&&newIcon!=='mada_credit') {//如果后端有返回图标 就用后端的
            const obj={visa,master,amex,jcb,discover,dinersclub,klarna,giropay,magna,multicaja,servipag,sencillito,safetypay,pagoefectivo,oxxo,carnet,qpay,mada,knet,spei,pse,boleto,apple_pay,hipercard,elo}
            return <div className={classNames(styles.cardLogo, className)}>
                {brandIcons.map(key=>{
                    return obj[key]?<span key={key}>{obj[key]}</span>:null
                })}
            </div>
        }
        switch (newIcon) {
            case 'Ocean_credit':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span style={{ width: 299 }}><img alt='card' src={qianhaiPay_icon} /></span>
                </div>);
            case 'Ebanx_credit_instalments':
                switch (country) {
                    case 'BR':
                        return <div className={classNames(styles.cardLogo, className)}>
                            <span>{visa}</span>
                            <span>{master}</span>
                            <span>{amex}</span>
                            <span>{hipercard}</span>
                            <span>{elo}</span>
                            <span>{dinersclub}</span>
                        </div>;
                    case 'MX':
                        return <div className={classNames(styles.cardLogo, className)}>
                            <span>{visa}</span>
                            <span>{master}</span>
                            <span>{amex}</span>
                            <span>{carnet}</span>
                        </div>;
                    default:
                        break;
                }
            case 'Ebanx_credit'://eslint-disable-line
                onicon = '';
                switch (country) {
                    case 'PE':
                        onicon = dinersclub;
                        break;
                    case 'MX':
                        onicon = carnet;
                        break;
                    default:
                        break;
                }
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{visa}</span>
                    <span>{master}</span>
                    <span>{amex}</span>
                    {onicon && <span>{onicon}</span>}
                </div>);
            case 'PacyPay_credit'://eslint-disable-line
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{visa}</span>
                    <span>{master}</span>
                </div>);
            case 'Stripe_credit':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{visa}</span>
                    <span>{master}</span>
                    <span>{amex}</span>
                    <span>{dinersclub}</span>
                    <span>{discover}</span>
                </div>);
            case 'all_credit'://Ebanx/PacyPay/Stripe
                onicon = '';
                switch (country) {
                    case 'MX':
                        onicon = carnet;
                        break;
                    default:
                        break;
                }
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{visa}</span>
                    <span>{master}</span>
                    <span>{amex}</span>
                    <span>{dinersclub}</span>
                    <span>{discover}</span>
                    {onicon && <span>{onicon}</span>}
                </div>);
            case 'Checkout_credit':
                // onicon = '';
                // switch (country) {
                //     case 'KW':
                //         onicon = knet;
                //         break;
                //     default:
                //         break;
                // }
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{visa}</span>
                    <span>{master}</span>
                    <span>{amex}</span>
                    {/* {onicon && <span>{onicon}</span>} */}
                </div>);
            case 'mada_credit':
                return (<div className={classNames(styles.cardLogo, className)}>
                    {/* <span>{mada}</span> */}
                    <span className={styles.mada_card}><img alt='card' src={mada_card} /></span>
                </div>);
            case 'WdPay_credit':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{jcb}</span>
                    <span>{visa}</span>
                    <span>{master}</span>
                    <span>{amex}</span>
                    <span>{dinersclub}</span>
                    <span>{discover}</span>
                </div>);
            case 'che_ad_wo'://Checkout_credit、Adyen_credit_credit
                return (<div className={classNames(styles.cardLogo, className)}>
                    {/* return (<div className={classNames(styles.cardLogo, !moreIcon && styles.cardLogoMore)}> */}
                    <span>{visa}</span>
                    <span>{master}</span>
                    <span>{amex}</span>
                    <span>{jcb}</span>
                    <span>{discover}</span>
                </div>);
            case 'webpay':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{visa}</span>
                    <span>{master}</span>
                    <span>{amex}</span>
                    <span>{magna}</span>
                </div>);
            case 'multicaja':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{multicaja}</span>
                </div>);
            case 'servipag':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{servipag}</span>
                </div>);
            case 'sencillito':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{sencillito}</span>
                </div>);
            case 'pagoefectivo':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{pagoefectivo}</span>
                </div>);
            case 'safetypay_cash':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{safetypay}</span>
                </div>);
            case 'oxxo':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{oxxo}</span>
                </div>);
            case 'spei':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{spei}</span>
                </div>);
            case 'pay_pal_credit'://普通支付
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{discover}</span>
                    <span>{dinersclub}</span>
                    <span>{amex}</span>
                </div>);
            case 'sofort':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{klarna}</span>
                </div>);
            case 'klarna_us':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{klarna}</span>
                </div>);
            case 'klarna_uk':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{klarna}</span>
                </div>);
            case 'klarna_eu':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{klarna}</span>
                </div>);
            case 'giropay':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{giropay}</span>
                </div>);
            case 'knet':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{knet}</span>
                </div>);
            case 'qpay':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{qpay}</span>
                </div>);
            case 'fast_pay_pal':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span className={styles.fast_pay_pal}>{paypal1}</span>
                </div>);
            case 'pcis':
                return (<div className={classNames(styles.pic)}>
                    <span><Sicon className={styles.pic_item} icon='mcafee' /></span>
                    <span><Sicon className={styles.pic_item} icon='mastercard_securecode' /></span>
                    <span><Sicon className={styles.pic_item} icon='verifiedbyvisa' /></span>
                    <span><Sicon className={styles.pic_item} icon='pci' /></span>
                </div>);
            case 'pse':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{pse}</span>
                </div>);
            case 'boleto':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{boleto}</span>
                </div>);
            case 'apple_pay':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{apple_pay}</span>
                </div>);
            case 'afterpay_au':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{afterpay}</span>
                </div>);
            case 'afterpay_us':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span>{afterpay}</span>
                </div>);
            case 'support':
                return (<div className={classNames(styles.cardLogo, className)}>
                    <span className={styles.fast_pay_pal}>{paypal1}</span>
                    <span>{visa}</span>
                    <span>{master}</span>
                    <span>{maestro}</span>
                    <span>{amex}</span>
                    <span>{discover}</span>
                    <span>{mada}</span>
                    <span>{klarna}</span>
                    <span>{apple_pay}</span>
                </div>);
            default://
                return null;
        }
    }
}

export default withTranslation()(Index);