/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component,Children } from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
class Tabs extends Component {
    constructor() {
        super();
        this.state = {
            currentIndex: '',//选中的
            underline: {left:0,width:'50%'},//滑动属性
        };
    }
    componentDidMount() {
        let { defaultActiveKey } = this.props;
        this.getLeftValue(defaultActiveKey);
        this.setState({ currentIndex: defaultActiveKey });
    }
    handleChange = (currentIndex) => {
        let { onChange } = this.props;
        this.getLeftValue(currentIndex);
        this.setState({currentIndex});
        onChange&&onChange(currentIndex)
    }
    getLeftValue=(currentIndex)=>{
        const { children } = this.props;
        let { underline } = this.state;
        let index=0,childLength=(children&&children.length)||0;
        if(childLength){
            children.forEach((item,ind)=>{
                if(item.key===currentIndex){
                    index=ind;
                }
            })
        };
        underline.left=`${((index/childLength)||0)*100}%`;
        underline.width=`${((1/childLength)||0)*100}%`;
        this.setState({underline});
    }
    render(props, state) {
        const { currentIndex,underline } = this.state;
        const { children } = this.props;
        let { order = {}} = window.shopify_checkouts || {};
        let { language = 'en'} = order || {};
        let isRtl=(language==='ar');
        return <div className={styles.tabs}>
            <div className={styles['nav-list']}>
                {Children.map(children, (element) => {
                    let { tab } = element.props || {};
                    return <div onClick={this.handleChange.bind(this,element.key)} key={element.key} className={classNames(styles.tab, currentIndex === element.key ? styles.active : '')}>
                        {tab}
                    </div>
                })}
                <div className={styles.underline} style={isRtl?{right:underline.left,width:underline.width}:{left:underline.left,width:underline.width}}/>
            </div>
            <div>
            {Children.map(children, (element, index) => {
                return <div key={element.key} className={classNames(styles['content-holder'])} style={{display: currentIndex === element.key ? 'block' : 'none'}}>
                    {element}
                </div>
            })}
            </div>
        </div>
    }
}
function TabPane(props) {
    return <div>{props.children}</div>;
}
export { Tabs, TabPane };