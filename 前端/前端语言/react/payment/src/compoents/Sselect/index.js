/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
import { funverify } from "../../utils"
import { Sicon } from "../index";


class Index extends Component {
    constructor(props) {
        super();
        this.state = {
            onFocus: false
        };
    }
    onFocus = (e) => {
        var value = e.target.value;
        const { onFocus } = this.props;
        onFocus && onFocus(value);
        this.setState({ onFocus: true })
    }
    onBlur = (e) => {
        var value = e.target.value;
        const { onBlur } = this.props;
        onBlur && onBlur(value);
        this.setState({ onFocus: false })
    }
    handleChange = (e) => {
        const { option = [] } = this.props;//eslint-disable-line
        var value = e.target.value;
        const { onChange, item, verify, } = this.props;
        funverify({ value, verify, item });
        onChange && onChange(value, option[e.target.selectedIndex].name,option[e.target.selectedIndex]);
    }
    render(props, state) {
        const { onFocus } = this.state;//theme:appTheme/hasTitle
        let { order = {} } = window.shopify_checkouts || {};
        let { language = 'en' } = order || {};
        let isRtl = (language === 'ar');
        const { children, readOnly, placeholder, className, option = [], item = {}, value, id, theme,verify,hideErrorMessage } = this.props;//eslint-disable-line
        return (<div className={classNames(styles.boxParent, theme && styles[theme], isRtl ? styles._rtl : '', className)}>
            <div className={classNames(styles.box, onFocus && styles.onFocus)}>
                <div className={styles.title}>{item.title&&<span>{item.title} {(verify[0]?.required) ? <span>*</span> : ''}</span>}</div>
                <label htmlFor={id} className={classNames(styles.selectBox, item.error && styles.error)}>
                    <label className={styles.labelTopFocus}>{placeholder}</label>
                    <select ref={s => this.select = s} id={id} onChange={this.handleChange} onFocus={this.onFocus} onBlur={this.onBlur} value={value} placeholder={placeholder}>
                        {option.length > 0 && option.map((item, index) => {
                            return <option key={index} value={item.code}>{item.name}</option>
                        })}
                    </select>
                    <div onClick={e => this.select.click()} className={styles.jiantou}><Sicon icon='fanhui' /></div>
                </label>
                {!hideErrorMessage&&item.error && item.message && <p className={styles.errorText}>{item.message}</p>}
            </div>
        </div>)
    }
}

export default Index;