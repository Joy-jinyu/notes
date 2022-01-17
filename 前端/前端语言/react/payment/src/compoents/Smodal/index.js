/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import { withTranslation } from "react-i18next";
import styles from './style.module.scss';
import { Sbutton } from "../index"
import { trigger, Throttling } from "@/utils"
class Index extends Component {
    constructor(props) {
        super();
        this.state = {
        };
    }
    componentDidMount() {
        const { onClose } = this.props;
        if (onClose) {
            document.addEventListener("keydown", this.onKeyDown)
        }
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.onKeyDown)
    }

    onKeyDown = (e) => {
        const { visible } = this.props;
        if (e && e.keyCode && visible) {
            switch (e.keyCode) {
                case 27://esc事件
                this.onClickFun('onClose');
                    break;
                default:
                    break;
            }
        }
    }
    onClickFun = (type, e) => {
        e?.stopPropagation && e.stopPropagation();
        const { onOk, onCancel, children = '', onClose } = this.props;
        let text = (typeof children === 'string') ? children : children?.props?.children;
        if (type === 'ok') {
            trigger('CheckoutCloseModal', { clickBtnType: 'ok', text });
            onOk && onOk();
        } else if (type === 'onClose') {
            trigger('CheckoutCloseModal', { clickBtnType: 'onClose', text });
            onClose && onClose()
        } else {
            trigger('CheckoutCloseModal', { clickBtnType: 'onCancel', text });
            onCancel && onCancel()
        }
    }
    init = (visible) => {
        let mo_app=document.getElementById('mo_app');
        if (visible) {
            document.body.style.overflow = 'hidden';
            mo_app&&(mo_app.style.overflow = 'hidden');
        } else {
            document.body.style.overflow = 'initial';
            mo_app&&(mo_app.style.overflow = 'initial');
        }
    }
    render(props, state) {
        const { t, className, id, type = 'alert', theme, children, visible, width, height, style, okText, cancelText, okLoading,title,columnBtn=false } = this.props;
        //type--confirm/alert
        this.init(visible);
        let isConfirm = (type === 'confirm');
        return visible ? <div id={id} className={styles.box}>
            <div className={styles.mask}></div>
            <div className={styles.wrap}>
                <div className={classNames(styles.modal, isConfirm && styles.confirmBox, className)} style={{ ...style, width, height }}>
                    {title&&<div className={styles.titleStyle}>{title}</div>}
                    <div className={styles.bodyStyle}>{children}</div>
                    <div className={classNames(styles.btnBox,columnBtn&&styles.columnBtn)}>
                        {isConfirm && <Sbutton onClick={this.onClickFun.bind(this, 'onCancel')}>{cancelText || t('CANCEL_big')}</Sbutton>}
                        <Sbutton type='primary' onClick={this.onClickFun.bind(this, 'ok')} loading={okLoading}>{okText || t('OK')}</Sbutton>
                    </div>
                </div>
            </div>
        </div> : null
    }
}

export default withTranslation()(Index);