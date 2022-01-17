/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
class Index extends Component {
    constructor(props) {
        super();
        this.state = {
        };
    }
    onChange = (e) => {
        const { onChange} = this.props;
        onChange && onChange(e)
    }
    render(props, state) {
        const { checked = false, children, readOnly, placeholder, className, icon} = this.props;//eslint-disable-line
        return <div onClick={this.onChange} className={classNames(styles.box, className)}>
            <input payment_method={icon} type="radio" defaultChecked={checked} className={classNames(styles.checkbox, checked && styles.ischecked)} placeholder={placeholder || null}></input>
            {children && <span>{children}</span>}
        </div>
    }
}

export default Index;