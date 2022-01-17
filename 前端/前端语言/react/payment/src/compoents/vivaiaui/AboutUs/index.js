import React, { Fragment } from "react";
import styles from './style.module.scss';
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import { trucks_icon } from "../ShippingMethed/assets"
let afterSale = <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.75" y="1.75" width="14.5" height="3.5" stroke="black" strokeWidth="1.5" />
    <path d="M2.75 5.75H15.25V16.25H2.75V5.75Z" stroke="black" strokeWidth="1.5" />
    <path d="M7.5 8L6 9.5H12" stroke="black" strokeWidth="1.5" strokeLinejoin="bevel" />
    <path d="M10.5 13.5L12 12H6" stroke="black" strokeWidth="1.5" strokeLinejoin="bevel" />
</svg>
    let currentLng = (document.documentElement.lang || 'en').toLocaleLowerCase();
    let isRtl = !!(currentLng === 'ar');
const OrderSummary = ({ t }) => {
    const list = [{ icon: trucks_icon, text: t('vivaia.timeliness') }, { icon: afterSale, text: t('vivaia.afterSale') }];
    return <ul className={classNames(styles.box, isRtl ? styles._rtl : '')}>
        {list.map((item,index) => {
            return <li key={index}>
                <div className={styles.icon}>{item.icon}</div>
                <div>{item.text}</div>
            </li>
        })}
    </ul>
}

export default withTranslation()(OrderSummary);
