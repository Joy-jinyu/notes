/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
class Index extends Component {
    constructor() {
        super();
        this.state = {
        };
    }
    render(props, state) {
        const {visible} = this.props;
        return visible?<div className={styles.mask}><span>数据返回中，请稍后</span></div>:null
    }
}

export default Index;