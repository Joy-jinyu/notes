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
        };
    }
    render(props, state) {
        const {list=[],onClick } = this.props;
        return (
            <ul className={styles.box}>
                {list.map((item,index)=>{
                    return <li key={index}>
                        <span className={styles.title}>{item.title}</span>
                        <span className={styles.content}>{item.content}</span>
                        {item.btnText&&<span className={styles.change} onClick={()=>{onClick&&onClick(item)}}>{item.btnText}</span>}
                    </li>
                })}
            </ul>)
    }
}

export default Index;