/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import classNames from "classnames";
import React, { Component } from "react";
import styles from './style.module.scss';
class Index extends Component {
    constructor() {
        super();
        this.state = {
        };
    }
    render(props, state) {
        const { isMobile } = this.props;
        return <div className={styles.box}>
            <ul className={styles.cardBox}>
                <li className={classNames(styles.skeletonBox)}>
                    <div className={classNames(styles.skeleton)} style={{ width: 250 }}></div>
                    <div className={classNames(styles.skeleton)} style={{ width: 120 }}></div>
                    <div className={classNames(styles.skeleton)} style={{ width: 180 }}></div>
                </li>
                <li className={classNames(styles.skeletonBox)}>
                    <div className={classNames(styles.skeleton)} style={{ width: 100 }}></div>
                    <div className={classNames(styles.skeleton)} style={{ width: 150 }}></div>
                </li>
                <li className={classNames(styles.skeletonBox)}>
                    <div className={classNames(styles.skeleton)} style={{ width: 100 }}></div>
                    <div className={classNames(styles.skeleton)} style={{ width: 150 }}></div>
                </li>
            </ul>
        </div>
    }
}

export default Index;