/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
import { funverify } from "../../utils"
import { Sicon,Smodal } from "../index";
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
        const { value = '', className,id, type,theme,onOk,viewClose,okText } = this.props;//theme--modal/mobile
        return (theme==='modal'?<Smodal okText={okText} visible={!!value} onOk={onOk} className={styles.modal}>
        {value}
        </Smodal>:<div id={id} className={classNames(styles.notice, theme&&styles[theme],styles[type], className,!value&&styles.show)}>
            <Sicon className={styles.gantanhao} icon='gantanhao'/>
            <div className={styles.content}><p className={styles.text}>{value}</p></div>
            {viewClose&&onOk&&<Sicon className={styles.guanbi} icon='guanbi' onClick={onOk}/>}
        </div>)
    }
}
export default Index;