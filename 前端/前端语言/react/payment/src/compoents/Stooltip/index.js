/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component, createRef } from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
import { querySelector } from '../../utils'
class Index extends Component {
    constructor(props) {
        super();
        this.state = {
        };
        this.input = createRef();
    }
    componentDidMount() {
        setTimeout(() => {
            this.initDom()
        }, 300)
        // let child=$(this.toolRef).find(".children");
        // child.hover(this.initDom);
    }
    initDom = () => {
        /* old */
        // let child = $(this.toolRef).find(".children");
        // let tooltip = $(this.toolRef).find(".tooltip");
        // let sj = $(this.toolRef).find("._sj");

        /* new */
        let parent = this.toolRef;
        let child = parent?.querySelector('.children')
        let tooltip = parent?.querySelector('.tooltip')
        let sj = parent?.querySelector('._sj')

        /* old */
        // let cw = child.width() || 0;
        // let tw = tooltip.width() || 0;
        // let cl = (tooltip.offset()&&tooltip.offset().left) || 0;
        // let ww = $(window).width() || 0;

        /* new */
        let cw = child?.clientWidth || 0
        let tw = tooltip?.clientWidth || 0;
        let cl = tooltip?.getBoundingClientRect()?.left || 0;
        let ww = document.documentElement.clientWidth || document.body.clientWidth || 0;
        /* old */
        // sj.css('left', cw / 2 - 6);//6是小三角的一半宽

        /* new */
        sj&&(sj.style.left = (cw / 2 - 6) + 'px')

        let tipLeft = -((tw - cw) / 2);//tip位置
        let leftToCenterW = cl + cw / 2;//窗口左边距离中心点位置
        let centerToRightW = Math.abs(ww - cl - (cw / 2));//中心点距离右边位置
        let ll = leftToCenterW - (tw / 2);//左边距
        let rr = centerToRightW - (tw / 2);//右边距
        if (ll < 0 || rr < 0) {
            if (ll > rr) {//需要左偏移
                tipLeft = tipLeft - (tw / 2 - centerToRightW) - 10;
            } else {//需要右偏移
                tipLeft = tipLeft + (tw / 2 - leftToCenterW) + 10;
            }
        }

        /* old */
        // tooltip.css('left', tipLeft);

        /* new */
        tooltip&&(tooltip.style.left = tipLeft + 'px')
    }
    handleCheck = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }
    render(props, state) {
        const { children, title, type, style } = this.props;//type现在有空/big
        let { order = {}} = window.shopify_checkouts || {};
        let { language = 'en'} = order || {};
        let isRtl=(language==='ar');
        return <div className={styles.toolbox} ref={e => this.toolRef = e} onClick={this.handleCheck}><div className={classNames('children', styles.children)}>{children}</div><div className={classNames('tooltips', styles.tooltips)} style={isRtl?{left:0}:{}}><span className={classNames('tooltip', styles.tooltip, styles[type])} style={style}>{title}</span><i className={classNames('_sj', styles._sj)}></i></div></div>
    }
}

export default Index;