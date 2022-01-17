/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component, Children } from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
import Dialog from 'rc-dialog';
class Index extends Component {
    constructor() {
        super();
        this.state = {
        };
    }
    render(props, state) {
        const { children,animation='zoom' } = this.props;
        return (<Dialog {...this.props}>{children}</Dialog>)
    }
}

export default Index;