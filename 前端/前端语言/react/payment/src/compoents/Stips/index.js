/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
import { funverify } from "../../utils"
const safety_icon= require('../../assets/safety_icon.png')
class Index extends Component {
    constructor() {
        super();
        this.state = {
            onFocus: false,//是否获取焦点状态（只判断是否获取焦点）
        };
    }
    handleChange = (e) => {
        var value = e.target.value;
        const { onChange, item, verify, } = this.props;
        funverify({ value, verify, item });
        onChange && onChange(value);
    }
    render(props, state) {
        const { onFocus } = this.state;
        const { value = '', className,id, type } = this.props;
        return <div id={id} className={classNames(styles.notice)}>
            <span className={styles.icon}><img alt='img' src={safety_icon} /></span>
            <div className={styles.content}><p className={styles.text}>{value}</p></div>
        </div>
    }
}

export default Index;