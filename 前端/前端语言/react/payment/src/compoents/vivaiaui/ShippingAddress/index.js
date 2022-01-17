import React, { Fragment } from "react";
import styles from './style.module.scss';
import { withTranslation } from "react-i18next";
import { ShippingFormatedAddress } from "../../../utils/shippingAddress";
import classNames from "classnames";

const Address = ({ t, formData, shop = {}, isMobile = false }) => {
    let adds = <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.6914 5.36491C17.7301 7.40366 17.7301 10.7091 15.6914 12.7479L11.9999 16.4394L8.30842 12.7479C6.26967 10.7091 6.26967 7.40366 8.30842 5.36491C10.3472 3.32616 13.6526 3.32616 15.6914 5.36491Z" stroke="black" strokeWidth="1.5" />
        <path d="M14.3002 9.5C14.3002 10.7703 13.2704 11.8 12.0002 11.8C10.7299 11.8 9.70018 10.7703 9.70018 9.5C9.70018 8.22975 10.7299 7.2 12.0002 7.2C13.2704 7.2 14.3002 8.22975 14.3002 9.5Z" stroke="black" strokeWidth="1.4" />
        <path d="M3 17V21H21V17H19.5V19.5H4.5V17H3Z" fill="black" />
    </svg>;
    let { address2, address1, email, first_name = '', last_name = '', phone } = formData || {};
    let currentLng = (document.documentElement.lang || 'en').toLocaleLowerCase();
    let isRtl = !!(currentLng === 'ar');
    return <div className={classNames(styles.box, isMobile && (styles.isMobile), isRtl ? styles._rtl : '')}>
        <div className={styles.left}>{adds}</div>
        <div className={styles.right}>
            <div className={styles.right_top}>
                {/* <div className={styles.right_top_1}>{address2 || address1 || ''}</div> */}
                <div className={styles.right_top_2}>{ShippingFormatedAddress(formData, shop, (isMobile ? '' : 'vivaia_ui'))}&nbsp; {email}</div>
            </div>
            <div className={styles.right_bottom}>
                <div className={styles.right_bottom_1}>{`${first_name || ''} ${last_name || ''}`}</div>
                <div className={styles.right_bottom_2}>{phone || ''}</div>
            </div>
        </div>
    </div>
}

export default withTranslation()(Address);
