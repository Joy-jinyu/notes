import React, { Fragment } from "react";
import styles from './style.module.scss';
import { withTranslation } from "react-i18next";
import classNames from "classnames";

const OrderSummary = ({ t, items = [] }) => {
    const num=()=>{
        let n=0;
        items?.length>0&&items.forEach(it=>{
            if(it.quantity){
                n=n+it.quantity;
            }
        });
        return n
    }
    return items && items.length > 0 ? <div>
        <div className={styles.title}>{t('vivaia.OrderSummary')}{`(${num()})`}</div>
        <div className={items && items.length > 2 ? styles.columnScroll : null}>
            <ul className={styles.box} style={items && items.length > 2 ? {}:{overflowY: 'auto'}}>
                {items.map(item => {
                    return <li className={classNames(item.noStock && styles.noStock)} key={item.sku}>
                        <div className={styles.left}>
                            <div className={styles.imgBox}>
                                <img alt="" src={item.image} />
                            </div>
                            {item.gift_card && <div className={styles.gift}><span>{t('GIFT')}</span></div>}
                        </div>
                        <div className={styles.right}>
                            <div className={styles.right_1}>{item.title}</div>
                            <div className={styles.right_2}>{item.goods_attr}</div>
                            <div className={styles.right_3}>x{item.quantity}</div>
                            {item.noStock && <span className={classNames(styles.badge, styles.stockout)}>{t('soldOut')}</span>}
                        </div>
                    </li>
                })}
            </ul>
        </div>
    </div> : null
}

export default withTranslation()(OrderSummary);
