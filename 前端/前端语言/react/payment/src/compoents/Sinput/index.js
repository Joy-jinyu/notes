/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
import { funverify } from "../../utils"
class Index extends Component {
    constructor() {
        super();
        this.state = {
            onFocus: false,//是否获取焦点状态（只判断是否获取焦点）
        };
    }
    onFocus = (e) => {
        var value = e.target.value;
        const { onFocus } = this.props;
        onFocus&&onFocus(value);
        this.setState({ onFocus: true })
    }
    onBlur = (e) => {
        var value = e.target.value;
        const { onBlur } = this.props;
        onBlur&&onBlur(value);
        this.setState({ onFocus: false });
    }
    handleChange = (e) => {
        var value = e.target.value;
        const { onChange, item, verify, } = this.props;
        funverify({ value, verify, item });
        onChange && onChange(value);
    }
    render(props, state) {//{classNames(styles.collapseTitle,theme&&styles[theme])}
        const { onFocus } = this.state;
        const { placeholder, item = {},value='',className,disabled=false, id ,type,theme} = this.props;
        return <div className={classNames(styles.boxParent,theme&&styles[theme],className)}>
            <div className={styles.box}>
            <label className={classNames(styles.labelBox, (onFocus||value) && styles.isFocus,onFocus&&styles.onFocus, item.error && styles.error)}>
                <label className={styles.labelTopFocus}>{placeholder}</label>
                <input maxLength={(item&&item.maxLength)||200} {...this.props} type={type} id={id} disabled={disabled} value={value} className={styles.defIndex} placeholder={(onFocus || item.error) ? null : placeholder} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.handleChange} />
            </label>
            {item.error&&item.message&&<p className={styles.errorText}>{item.message}</p>}
        </div>
        </div>
    }
}

export default Index;