/*
 * @Author: yangj
 * @Date: 2021-12-08 16:15:54
 * @LastEditors: yangj
 */
import React from "react";
import styles from './style.module.scss';
import { withTranslation } from "react-i18next";
import {trucks_icon,plane} from "./assets"
import classNames from "classnames";
import {currencySymbol} from "../../../utils"

const ShippingMethed = ({ t, item={},isMobile=false }) => {
    const hasPrice=(item.price*1)>0;
    let {originPrice,describe=''}=item||{};
    originPrice=((originPrice*1===0)?0:originPrice);
    // let currentLng = (document.documentElement.lang || 'en').toLocaleLowerCase();
    // let isRtl = !!(currentLng === 'ar');
    return <div className={classNames(styles.box, isMobile && (styles.isMobile))}>
        <div className={styles.left}>{item===2?plane:trucks_icon}</div>
        <div className={styles.right}>
            <div className={styles.right_l}>
                <div className={styles.right_l_1}>{item.name}</div>
                {describe&&<div className={styles.right_l_2}>{describe}</div>}
            </div>
            <div className={styles.right_r}>
                <div className={classNames(styles.right_r_1,!hasPrice&&styles.Free)}>{hasPrice?`${currencySymbol()}${item.price}`:t('Free')}</div>
                {originPrice?<div className={styles.right_r_2}>{`${currencySymbol()}${item.originPrice}`}</div>:null}
            </div>
        </div>
    </div>
}

export default withTranslation()(ShippingMethed);
