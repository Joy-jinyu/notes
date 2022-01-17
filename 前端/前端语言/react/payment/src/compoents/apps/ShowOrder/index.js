/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import classNames from 'classnames';
import { Sbutton, Sinput, Stag } from '../../index';
import { currencySymbol } from "../../../utils"
import styles from './style.module.scss';
import BuyGiftTips from '../BuyGiftTips'
import ChooseUs from '../ChooseUs'
import { apply_discount_code, harbor_preview, remove_discount_code } from "../../../api/api"
class Index extends Component {
    constructor({ t, i18n }) {
        super();
        this.state = {
            isHide: true,//按钮状态
            isShowDiscount: true,//是否显示优惠券
            switchIn: false,//是否在动画中
            arrowDown: 'M.504 1.813l4.358 3.845.496.438.496-.438 4.642-4.096L9.504.438 4.862 4.534h.992L1.496.69.504 1.812z',
            arrowUp: 'M6.138.876L5.642.438l-.496.438L.504 4.972l.992 1.124L6.138 2l-.496.436 3.862 3.408.992-1.122L6.138.876z',
            datas: {
                subtotal: '100.66',
                total: '100.66',
                list: [
                    { title: 'Women Autumn Winter Casual Daily Stretchy Asymmetrical Sweater', num: '1', attribute: 'S / Black', oldPrice: '', price: '64.88', img: 'https://cdn.shopify.com/s/files/1/0105/1705/3502/products/025c94d5d3079082d3971679d54bb314_small.jpg?v=1575275897' },
                    { title: 'Women Autumn Winter Casual Daily Stretchy Asymmetrical Sweater', num: '1', attribute: 'S / Black', oldPrice: '88.88', price: '64.88', img: 'https://cdn.shopify.com/s/files/1/0105/1705/3502/products/025c94d5d3079082d3971679d54bb314_small.jpg?v=1575275897' },
                ]
            },
            currentCode: { discountCode: '', discountAmount: 0 },//当前优惠吗
            couponCode: '',
            applyLoading: false,
            errorTip: { error: false, message: '' },
        };
    }
    componentDidMount() {
        let { order = {} } = window.shopify_checkouts || {};
        let { discountCode = '', discountAmount = 0 } = order || {};
        this.setState({ currentCode: { discountCode, discountAmount } });
    }
    switchArrow = () => {
        let { isHide } = this.state;
        this.setState({ isHide: !isHide, switchIn: true });
        setTimeout(() => {
            this.setState({ switchIn: false });
        }, 150)
    }
    switchDiscount = () => {
        let { isShowDiscount } = this.state;
        this.setState({ isShowDiscount: !isShowDiscount });
    }
    sinputChange = (couponCode) => {
        // const { fromData } = this.state;
        // if (type) {
        // 	fromData[type] = val;
        this.setState({ couponCode, errorTip: { error: false, message: '' } })
        // }
    }
    onCloseTag = (code) => {
        let { shop = {}, order = {} } = window.shopify_checkouts || {};
        let { uuid = '' } = order || {};
        const { currentCode } = this.state;
        // let urlData = `?identity_code=${shop.identity_code}&couponCode=${encodeURIComponent(currentCode.discountCode)}&uuid=${uuid}`
        currentCode.discountCode = encodeURIComponent(currentCode.discountCode)
        remove_discount_code({ identity_code: shop.identity_code, couponCode: currentCode.discountCode, uuid }).then(res => {
            const { callback } = this.props;
            if (res && res.isOk) {
                this.setState({ currentCode: { discountCode: '', discountAmount: 0 } });
                callback && callback(res);
            } else { alert('server error') }
        })
    }
    applyCode = async () => {
        let { shop = {}, order = {} } = window.shopify_checkouts || {};
        let { uuid = '', items_subtotal_price = '', total_quantity = '' } = order || {};
        let { platform_name, name } = shop;
        let { couponCode } = this.state;
        this.setState({ applyLoading: true });
        const { t } = this.props;
        if (platform_name === "HARBOR") {
            harbor_preview({ uuid, shopName: name, couponCode }).then(res => {
                initData(res);
            }).finally(e => {
                this.setState({ applyLoading: false });
            })
        } else {
            // couponCode = encodeURIComponent(couponCode)
            apply_discount_code({ identity_code: shop.identity_code, couponCode, uuid, subtotalAmount: items_subtotal_price, quantity: total_quantity }).then(res => {
                initData(res);
            }).finally(e => {
                this.setState({ applyLoading: false });
            });
        };
        const initData = (res) => {
            let { isOk, amount = 0 } = res || {};
            const { callback } = this.props;
            if (isOk) {
                this.setState({ errorTip: { error: false, message: '' }, currentCode: { discountCode: couponCode, discountAmount: Math.abs(amount) }, couponCode: '' });
                callback && callback(res);
            } else {
                this.setState({ errorTip: { error: true, message: t('discountCode.errorMessage') } });
            }
        }
    }
    renderDiscount = (currentCode) => {//处理不同来源的优惠显示
        const { t } = this.props;
        let { discountCode, discountAmount = 0 } = currentCode || {};
        let { shop = {}, order = {} } = window.shopify_checkouts || {};
        let { platform_name } = shop;
        let { discounts = [] } = order || {};
        let isnumber = (typeof discountAmount === 'number') && discountAmount > 0;
        let isGALAXY = (platform_name === "GALAXY");
        if ((discountCode && isnumber) || isnumber || isGALAXY) {
            if (platform_name === "HARBOR" || isGALAXY) {
                if (discounts && discounts.length) {
                    return discounts.map((item, index) => {
                        return <div key={index} className={classNames(styles.subtotal)}>
                            <div>
                                <span>{item.title}</span>
                            </div>
                            <span className={styles.text}>{isGALAXY ? `-${currencySymbol()}` : ''}{item.price}</span>
                        </div>
                    })
                } else {
                    return null
                }
            } else {
                return <div className={classNames(styles.subtotal)}>
                    <div>
                        <span>{t('Discount')}</span>
                        {discountCode && <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M17.78 3.09C17.45 2.443 16.778 2 16 2h-5.165c-.535 0-1.046.214-1.422.593l-6.82 6.89c0 .002 0 .003-.002.003-.245.253-.413.554-.5.874L.738 8.055c-.56-.953-.24-2.178.712-2.737L9.823.425C10.284.155 10.834.08 11.35.22l4.99 1.337c.755.203 1.293.814 1.44 1.533z" fillOpacity=".55"></path><path d="M10.835 2H16c1.105 0 2 .895 2 2v5.172c0 .53-.21 1.04-.586 1.414l-6.818 6.818c-.777.778-2.036.782-2.82.01l-5.166-5.1c-.786-.775-.794-2.04-.02-2.828.002 0 .003 0 .003-.002l6.82-6.89C9.79 2.214 10.3 2 10.835 2zM13.5 8c.828 0 1.5-.672 1.5-1.5S14.328 5 13.5 5 12 5.672 12 6.5 12.672 8 13.5 8z"></path></svg>
                            <span>{discountCode}</span>
                        </>}
                    </div>
                    <span className={styles.text}>-{currencySymbol()}{discountAmount}</span>
                </div>
            }
        } else {
            return null
        }

    }
    renderSwitchDiscount = () => {
        const { t, hideInput } = this.props;
        const { isShowDiscount, currentCode, couponCode, applyLoading, errorTip = {} } = this.state;
        let { shop = {} } = window.shopify_checkouts || {};
        let { platform_name } = shop;
        if (platform_name === "HARBOR" || platform_name === "GALAXY") {
            return currentCode.discountCode ? <div className={styles.discountCode}>
                <div className={styles.tag}>
                    {currentCode.discountCode && <Stag code={currentCode.discountCode} />}
                </div>
            </div> : null
        } else {
            return (!hideInput || currentCode.discountCode) ? <div className={styles.discountCode}>
                {!hideInput && <div>
                    <div onClick={this.switchDiscount} className={styles.switchDiscount}>{isShowDiscount ? <><i>-</i><span>{t('discountCode.hideText')}</span></> : <><i>+</i>{currentCode.discountCode ? <span>{t('discountCode.discountApplied')}<span>✓ </span></span> : <span>{t('discountCode.label')}</span>}</>}</div>
                    <div className={classNames(styles.inputParent, !isShowDiscount && styles.hideDiscount)}>
                        <div className={styles.input}><Sinput disabled={applyLoading} value={couponCode} item={errorTip} placeholder={t('discountCode.placeHolder')} onChange={this.sinputChange.bind(this)} /></div>
                        <Sbutton type="primary" disabled={!couponCode} onClick={this.applyCode} loading={applyLoading}>{t('discountCode.applyButton')}</Sbutton>
                    </div>
                </div>}
                <div className={styles.tag}>
                    {currentCode.discountCode && <Stag code={currentCode.discountCode} onClose={!hideInput && this.onCloseTag} />}
                </div>
            </div> : null
        }
    }
    initImgUrl = (gifSku = []) => {
        let arr = [];
        gifSku && gifSku.length > 0 && gifSku.forEach(item => {
            arr.push(Object.assign({}, item, { image: `/image_cache/resize/335x445/image/${item.image || ''}` }));
        });
        return arr
    }
    paypalLaterUI = () => {
        if (window.shopify_checkouts && window.shopify_checkouts.shop && window.shopify_checkouts.shop.pay_pal_is_active) {
            let { order = {}, shop = {} } = window.shopify_checkouts || {};
            let { all_price = 0 } = order;
            const { formData } = this.props;
            const { country } = formData || {};
            const { default_country = "" } = shop;

            return default_country === "US" && country === "US" && all_price > 0 && <div className={styles.paypalLater}>
			<div
				data-pp-message
				data-pp-buyercountry="US"
				data-pp-style-layout="text"
				data-pp-style-logo-type="inline"
				data-pp-style-text-color="black"
				data-pp-style-logo-position="top"
				data-pp-amount={all_price}>
			</div>
			<div className={styles.paypalLaterExplain}>If <i>Pay Later</i> button available, You can click it to apply  pay in 4 interest-free.</div>
		</div>
        }

    }

    render(props, state) {
        const { t, className } = this.props;
        const { isHide, arrowDown, arrowUp, switchIn, currentCode, couponCode, applyLoading, errorTip } = this.state;
        const { discountAmount = 0 } = currentCode || {};
        const { shipping = 0, tax = 0, special_zero = false } = this.props;
        let { order = {}, shop = {} } = window.shopify_checkouts || {};
        const { items = [], total_price, items_subtotal_price, currency } = order;
        const { platform_name } = shop;
        let listheight = (this.listDom && this.listDom.offsetHeight) || 510;
        let nubShipping = (shipping * 1) || 0;//邮费
        // let nubTax = Number.prototype.precision(((tax * 1) || 0)*nubShipping);//邮费的税
        let nubTotal_price = (total_price * 1) || 0;
        let isGALAXY = !!(platform_name === "GALAXY");//GALAXY的话 所有价格都是加好了的
        let all_price = isGALAXY ? nubTotal_price : Number.prototype.precision(nubTotal_price + nubShipping - discountAmount);
        let no_shipping_price = isGALAXY ? nubTotal_price : Number.prototype.precision(nubTotal_price - discountAmount);
        all_price < 0 && (all_price = 0);
        if (window.shopify_checkouts && window.shopify_checkouts.order) {
            window.shopify_checkouts.order.all_price = all_price;
            window.shopify_checkouts.order.no_shipping_price = no_shipping_price
        }
        return <div className={classNames(styles.showOrderPatent, className)}>
            <button className={styles.showOrder} onClick={this.switchArrow}>
                <span className={styles.dLHAHd}>
                    <span className={styles.gODadQ}><svg version="1.1" viewBox="0 0 20 19" style={{ width: '1.25rem', height: '1.1875rem' }}><path d="M17.178 13.088H5.453c-.454 0-.91-.364-.91-.818L3.727 1.818H0V0h4.544c.455 0 .91.364.91.818l.09 1.272h13.45c.274 0 .547.09.73.364.18.182.27.454.18.727l-1.817 9.18c-.09.455-.455.728-.91.728zM6.27 11.27h10.09l1.454-7.362H5.634l.637 7.362zm.092 7.715c1.004 0 1.818-.813 1.818-1.817s-.814-1.818-1.818-1.818-1.818.814-1.818 1.818.814 1.817 1.818 1.817zm9.18 0c1.004 0 1.817-.813 1.817-1.817s-.814-1.818-1.818-1.818-1.818.814-1.818 1.818.814 1.817 1.818 1.817z"></path></svg></span>
                    <span className={styles.ldbDXg}><span style={{ marginRight: ' 0.4rem' }}>{isHide ? t('calculate.summary.showLabel') : t('calculate.summary.hideLabel')}</span><svg version="1.1" viewBox="0 0 11 6" className={switchIn ? styles.switchIn : styles.jiantou}><path d={isHide ? arrowDown : arrowUp}></path></svg></span>
                    <span className={styles.jljHEQ}><span className={styles.gfUKyX}>{currencySymbol()}{all_price}</span></span>
                </span>
            </button>
            <div style={switchIn ? { height: listheight, opacity: 0.5 } : null} className={classNames(styles.list, (!switchIn && !isHide && styles.listOpen) || null)} ref={(c) => this.listDom = c || {}}>
                {order.gifSku && order.gifSku.length > 0 && <BuyGiftTips buyGiftList={this.initImgUrl(order.gifSku)} t={t} />}
                <div className={styles.tableBox}>
                    <table>
                        <tbody>
                            {items && items.length > 0 && items.map((item, index) => {
                                return <tr key={index} className={item.noStock && styles.noStock}>
                                    <td className={styles.tdImg}>
                                        <div className={styles.tdChild}>
                                            <div className={styles.imgBox}>
                                                <img alt="" src={item.image} />
                                            </div>
                                            <span className={styles.badge}>{item.quantity}</span>
                                        </div>
                                    </td>
                                    <td className={styles.tdCenter}>
                                        <span className={styles.jieawO}>{item.title}</span>
                                        <span className={styles.iLvyRB}>{item.variant_title}</span>
                                        {item.noStock && <span className={classNames(styles.badge, styles.stockout)}>{t('soldOut')}</span>}
                                    </td>
                                    <td className={styles.price}>
                                        {(item.original_price && item.original_price !== item.price) ? <del className={styles.oldPrice}>{currencySymbol()}{item.original_price}<br /></del> : null}
                                        <span>{currencySymbol()}{item.price || 0}</span>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={styles.totalAll}>
                    {/* 处理不同来源的优惠券是否能添加 */}
                    {this.renderSwitchDiscount()}
                    <div className={classNames(styles.subtotal)}>
                        <span>{t('calculate.subtotal')}</span>
                        <span className={styles.text}>{currencySymbol()}{items_subtotal_price}</span>
                    </div>
                    {/* 处理不同来源的优惠券显示 */}
                    {this.renderDiscount(currentCode)}
                    {shipping * 1 > 0 && <div className={classNames(styles.subtotal)}>
                        <span>{t('calculate.shipping')}</span>
                        <span>{currencySymbol()}{nubShipping}</span>
                    </div>}
                    {/* {tax * 1 > 0 && <div className={classNames(styles.subtotal)}>
                        <span>Tax</span>
                        <span>${nubTax}</span>
                    </div>} */}
                </div>
                <div className={classNames(styles.totalAll, styles.subtotal, styles.total)}>
                    <span>{t('calculate.total')}</span>
                    <span><span className={styles.usd}>{currency || 'USD'}</span><span className={styles.text}>{currencySymbol()}{special_zero ? 0 : all_price}</span></span>
                </div>
                {this.paypalLaterUI()}
                <div className={styles.chooseUs}><ChooseUs /></div>
            </div>
        </div>
    }
}

export default withTranslation()(Index);