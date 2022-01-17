
import React, { Component } from "react";
import styles from './style.module.scss';
import classNames from 'classnames';
import { RenderCardImg } from '../index';
import { Sradio, Sicon, Stooltip } from '../../index';
import { currencySequence, loadscript } from '../../../utils';
import AfterPayTitle from './AfterPayTitle'
const isMobile = document.body.clientWidth < 750;
class GiftItem extends Component {
    constructor(props) {
        super();
        this.state = {
            credits: ['credit', 'mada_credit'],
        }
    }
    componentDidMount() {
    }
    viewDiscount(item = {}) {
        const { t = {} } = this.props;
        const { discountType, discountAmount, ruleParam, ruleCheck } = item.discount || {};//discountType1-满减，2-折扣,discountAmount 金额,ruleParam折扣xx或减xx
        const initTip = () => {
            if (isMobile) {
                return <Stooltip style={{ whiteSpace: 'nowrap', fontWeight: 'normal' }} title={`${t('onOrderOver')} ${currencySequence(ruleCheck)}`}>
                    <div className={styles.svgLock}>
                        <Sicon className={styles.gantanhao} icon='gantanhao' />
                    </div>
                </Stooltip>
            } else {
                return <span className={styles.discountText}>{t('onOrderOver')} {currencySequence(ruleCheck)}</span>
            }
        }
        if (discountType && discountAmount) {
            return <div className={styles.discountBox}><div className={styles.discount}>{this.initOffView(discountType, ruleParam)}</div>{ruleCheck ? initTip() : null}</div>
        }
    }
    initOffView = (discountType, ruleParam) => {//折扣
        const { order = {}, shop = {} } = window.shopify_checkouts || {};
        const { t = {} } = this.props;
        const { language = '' } = order || {};
        if (language === 'ar') {
            if (discountType === 1) {//满减
                return `${t('OFF')} ${currencySequence(ruleParam)}`
            } else {//折扣
                return `${t('OFF')} ${ruleParam}%`
            }
        } else {
            if (discountType === 1) {//满减
                return ` ${currencySequence(ruleParam)} ${t('OFF')}`
            } else {//折扣
                return `${ruleParam}% ${t('OFF')}`
            }
        }
    }
    render() {
        const { t = {}, item = {}, isActive = false, hasRadio, title, icon, onClick, formData, theme, style, subhead, direction = '', className } = this.props;//subhead副标题 direction默认为column，可选row
        const {payMethod}=item||{};
        // const now_pay_discount = this.viewDiscount();//优惠折扣显示
        // const discountDom = now_pay_discount && <div className={styles.discount}>{this.initOffView()}</div>
        const main = <div><div className={styles.subhead}>{title || subhead}</div><RenderCardImg icon={icon} formData={formData} item={item}/></div>;
        const pay_pal_credit_type = <div className={styles.pay_pal_credit_box}>
            <Sicon className={styles.paypal_logo} icon='paypal_logo' />
            <RenderCardImg icon={icon} formData={formData} item={item}/>
        </div>
        const appTheme = <div className={classNames(styles.apptheme, className, isActive && styles.isActive)} style={style} onClick={onClick}>
            {!isMobile && <Sradio checked={isActive} icon={icon}></Sradio>}
            <div className={classNames(styles.main)}>{title ? <div className={styles.title}><span className={styles.text}>{title}</span>{this.viewDiscount(item)}</div> : null}
                {payMethod==='AfterPay'?<AfterPayTitle item={item}/>:(icon === 'pay_pal_credit' ? pay_pal_credit_type : <div className={styles.cardImgBox}><RenderCardImg icon={icon} formData={formData} item={item}/>{title ? null : this.viewDiscount(item)}</div>)}
                {subhead && <div className={styles.subhead}>{subhead}</div>}
            </div>
            {isMobile && <Sradio checked={isActive} icon={icon}></Sradio>}
        </div>
        return theme === 'appTheme' ? appTheme : (
            <div className={classNames(styles.collapseTitle, isActive && styles.isActive, styles.row, theme && styles[theme])} style={style} onClick={onClick}>
                {direction === 'column' ? (hasRadio ? <Sradio checked={isActive} icon={icon}>{main}</Sradio> : main) : <>
                    <div className={styles.titleLeft}>
                        <div>{hasRadio ? <Sradio checked={isActive} icon={icon}>{title}</Sradio> : <>{title}<div className={styles.subhead}>{subhead}</div></>}</div>
                    </div>
                    <RenderCardImg icon={icon} formData={formData} item={item}/>
                </>}
            </div>
        );
    }
}

export default GiftItem;