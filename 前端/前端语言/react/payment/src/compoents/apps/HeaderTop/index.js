
import React, { Component } from "react";
import styles from './style.module.scss';
import classNames from 'classnames';
import { withTranslation } from "react-i18next";
import { Logo } from "../index"
import { Sicon } from '../../index';
class Index extends Component {
    constructor({ t }) {
        super();
    }
    render() {
        let { t = {}, backText } = this.props;
        backText = backText || `<${t('BACK')}`
        return (
            <div className={styles.top}>
                <Logo className={styles.logo} />
                <div className={styles.top_right}>
                    <Sicon className={styles.secure} icon='secure' />
                    <span>{t('SecureCheckout')}</span>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Index);