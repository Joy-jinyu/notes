/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
import { funverify } from "../../utils"
//信用卡分期块儿
class Index extends Component {
    constructor() {
        super();
        this.state = {
        };
    }
    handleChange = (value, name, ite) => {
        const { option = [] } = this.props;//eslint-disable-line
        const { onChange, item, verify, } = this.props;
        funverify({ value, verify, item });
        onChange && onChange(value, name, ite);
    }
    render(props, state) {
        const { title, readOnly, placeholder, className, option = [], item = {}, value, id, theme, verify, hideErrorMessage } = this.props;
        return (
            <div className={styles.box}>
                {title && <div className={styles.title}>{title}</div>}
                <ul className={styles.uls}>
                    {option.length > 0 && option.map((item, index) => {
                        return <li onClick={this.handleChange.bind(this, item.code, item.name, item)} className={classNames(styles[`num_${index}`], item.code === value && styles.active)} key={index}>
                            <div><span>{item.name}</span></div>
                            {item.name2 && <div><span>{item.name2}</span></div>}
                        </li>
                    })}
                </ul>
            </div>)
    }
}

export default Index;