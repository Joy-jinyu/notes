import React, { Component } from "react";
import styles from './style.module.scss';
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import { currencySymbol, Debounce, scrollToId,currencySequence } from "../../../utils"
import { ShippingAddress,ShippingMethed } from "../../vivaiaui/index"
class Index extends Component {
    constructor({ t, i18n }) {
        super();
        this.state = {
            isHide: true,//按钮状态
            isShowDiscount: true,//是否显示优惠券
            switchIn: false,//是否在动画中
            arrowDown: 'M11 3.5L6.24264 8.25736L1.48528 3.5',
            arrowUp: 'M11 8.5L6.24264 3.74264L1.48528 8.5',
            currentCode: { discountCode: '', discountAmount: 0 },//当前优惠吗
            couponCode: '',
            applyLoading: false,
            errorTip: { error: false, message: '' },
        };
    }
    componentDidMount() {//为了在初始化时候执行一次
        this.initInput();
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextState) {//初始化时候不执行
        Debounce('cpfErrorFun', () => {
            this.initInput();
        });
    }
    initInput = () => {
        const { cpfItme = [] } = this.props;
        if (cpfItme.length) {
            let { isHide } = this.state;
            for (let i = 0; i < cpfItme.length; i++) {
                if (cpfItme[i]?.error && isHide) {
                    this.switchArrow();
                    setTimeout(() => {
                        scrollToId('cpf');
                    }, 200)
                    break;
                }
            };
        }
    }
    switchArrow = () => {
        let { isHide } = this.state;
        this.setState({ isHide: !isHide, switchIn: true });
        setTimeout(() => {
            this.setState({ switchIn: false });
        }, 150);
    }
    intiItems = (items = []) => {
        return <div className={classNames(styles.MobileOrder)}>
            <ul className={styles.intiItems}>
                {items.map((item) => {
                    return <li key={item.sku}>
                        <div className={styles.imgBox}>
                            <img alt="" src={item.image} />
                        </div>
                        <div className={styles.orderRight}>
                            <div className={styles.orderRightTop}>
                                <div className={styles.title1}>{item.title}</div>
                                <div className={styles.title2}>{item.goods_attr}</div>
                            </div>
                            <div className={styles.orderRightBottom}>
                                <div>{currencySequence(item.price)}</div>
                                <div style={{fontWeight:'normal'}}>x{item.quantity}</div>
                            </div>
                        </div>
                    </li>
                })}
            </ul>
        </div>
    }
    render(props, state) {
        let { order = {}, shop = {} } = window.shopify_checkouts || {};
        let { all_price = 0 } = order;
        let { isHide, switchIn, arrowDown, arrowUp } = this.state;
        let listheight = (this.listDom && this.listDom.offsetHeight) || 510;
        let { t, children, items = [], formData = {}, onGateWayItem = {}, isMIDDLE = false, parentState = {} } = this.props;
        const {shipping_method_list=[]}=parentState||{};
        const cart = <svg viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M13.873 5C13.6958 4.31397 13.338 3.68111 12.8284 3.17157C12.0783 2.42143 11.0609 2 10 2C8.93913 2 7.92172 2.42143 7.17157 3.17157C6.66203 3.68111 6.30416 4.31397 6.12701 5H13.873ZM4.08389 5C4.29016 3.77969 4.87067 2.64405 5.75736 1.75736C6.88258 0.632141 8.4087 0 10 0C11.5913 0 13.1174 0.632141 14.2426 1.75736C15.1293 2.64405 15.7098 3.77969 15.9161 5H19C19.5523 5 20 5.44772 20 6V21C20 21.5523 19.5523 22 19 22H1C0.447715 22 0 21.5523 0 21V6C0 5.44772 0.447716 5 1 5H4.08389ZM18 7V20H2V7H18Z" fill="black" />
        </svg>;
        return <div className={styles.showOrderPatent}>
            <button className={styles.showOrder} onClick={this.switchArrow}>
                <div className={styles.dLHAHd}>
                    <div className={styles.button_left}>
                        {cart}
                        <span className={styles.ldbDXg}><span>{t('vivaia.OrderSummary')}</span><svg viewBox="0 0 12 12" className={switchIn ? styles.switchIn : styles.jiantou} fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d={isHide ? arrowDown : arrowUp} stroke="black" strokeOpacity="0.5" strokeWidth="1.3" />
                        </svg></span>
                    </div>
                    <div className={styles.jljHEQ} style={{ opacity: isHide ? 1 : 0 }}>
                        <span className={styles.gfUKyX}>{currencySymbol(onGateWayItem?.currency)}{all_price}</span>
                        {isMIDDLE && <span className={styles.pcVat}>({t('VATIncluded')})</span>}
                    </div>
                </div>
            </button>
            <div style={switchIn ? { height: listheight, opacity: 0.5 } : null} className={classNames(styles.list, (!switchIn && !isHide && styles.listOpen) || null)} ref={(c) => this.listDom = c || {}}>
                <ShippingAddress formData={formData} shop={shop} isMobile={true} />
                <ShippingMethed item={(shipping_method_list && shipping_method_list[0]) || {}} isMobile={true} />
                {this.intiItems(items || [])}
                {children}
            </div>
        </div>
    }
}

export default withTranslation()(Index);
