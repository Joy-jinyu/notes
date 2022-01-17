
import React, { Component } from "react";
import { Stooltip, Smodal, Sicon } from '../../index';
import styles from './style.module.scss';
import classNames from 'classnames';
const cvv3 = require('../../../assets/cvv3.png')
const cvv4 = require('../../../assets/cvv4.png')
class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
            visible: false
        }
    }
    setvisible = (visible) => {
        this.setState({ visible });
        // 传递状态给父组件
        if (this.props.onVisible) {
            this.props.onVisible(visible)
        }

    }
    render(props, state) {
        const { t } = this.props;
        const { visible } = this.state;
        let isMobile = document.body.clientWidth < 750;
        let cvvTip = <ul className={classNames(styles.modalBox,isMobile&&styles.modalBoxMo)}>
            <li>
                <div className={styles.title}>· {t('paymentMethod.creditCard.whatCvv')}</div>
                <div className={styles.tip}>{t('paymentMethod.creditCard.tipFor3digits')}</div>
                <div className={styles.imgBox}><img alt="" src={cvv3} data-loaded="true" /></div>
            </li>
            <li>
                <div className={styles.title}>· {t('paymentMethod.creditCard.whatCvv2')}</div>
                <div className={styles.tip}>{t('paymentMethod.creditCard.tipFor4digits')}</div>
                <div className={styles.imgBox}><img alt="" src={cvv4} data-loaded="true" /></div>
            </li>
        </ul>
        return isMobile ? <div>
            <div className={classNames(styles.svgLock, styles.explainBox)} onClick={(e) => { e.preventDefault(); this.setvisible(true) }}>
                <Sicon className={styles.card_icon} icon='description' />
            </div>
            <Smodal visible={visible} onOk={() => { this.setvisible(false) }}>
            {cvvTip}
            </Smodal>
        </div> : <Stooltip title={cvvTip}>
                <div className={classNames(styles.svgLock, styles.explainBox)}>
                    <Sicon className={styles.card_icon} icon='description' />
                </div>
            </Stooltip>

    }
}
export default Index;