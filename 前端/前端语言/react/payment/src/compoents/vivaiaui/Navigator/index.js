import React, { Fragment } from "react";
import styles from './style.module.scss';
import { withTranslation } from "react-i18next";

const Navigator = ({ t }) => {
    let completed = <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6.5" r="6" fill="#26652C" />
        <path d="M3.5 6L5.5 8L9 4.5" stroke="white" strokeWidth="1.5" />
    </svg>
    return <div className={styles.navBox}>
        <div className={styles.completed}>
            {completed}
            <span>{t("vivaia.navigator.address")}</span>
        </div>
        <div className={styles.completed}>
            {completed}
            <span>{t("vivaia.navigator.shipping")}</span>
        </div>
        <div className={styles.on}>
            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6" cy="6.5" r="6" fill="black" />
                <path d="M5 3.5L8 6.5L5 9.5" stroke="white" strokeWidth="1.5" />
            </svg>
            <span>{t("vivaia.navigator.payment")}</span>
        </div>
    </div>
}

export default withTranslation()(Navigator);
