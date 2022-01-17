/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import styles from './style.module.scss';
class Index extends Component {
    constructor({ t, i18n }) {
        super();
        this.state = {
        };
        this.chooseUs = [
            { title: t('whyChooseUs.thirtyDayTitle'), explain: t('whyChooseUs.thirtyDaySubTitle'), img: 'https://cdn1.intercart.io/default/money_back_01.svg' },
            { title: t('whyChooseUs.over5WTitle'), explain: t('whyChooseUs.over5WSubtitle'), img: 'https://cdn1.intercart.io/default/truck_01.svg' },
        ]
    }
    render(props, state) {
        const { t ,bgColor} = this.props;
        return <div className={styles.chooseUs}>
            <div className={styles.line}><span className={styles.text} style={bgColor?{backgroundColor:bgColor}:{}}>{t('whyChooseUs.label')}</span></div>
            <ul>
                {this.chooseUs.map((item, index) => {
                    return <li key={index}>
                        <div className={styles.img}><img alt="" style={{ width: '57%' }} src={item.img} /></div>
                        <div className={styles.text}>
                            <span>{item.title}</span>
                            <p>{item.explain}</p>
                        </div>
                    </li>
                })}
            </ul>
        </div>
    }
}

export default withTranslation()(Index);