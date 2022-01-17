/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component} from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
import { Sradio } from '../../index';
import { funverify,currencySymbol } from "../../../utils"
class Index extends Component {
    constructor(props) {
        super();
        this.state = {
            defaultValue:'',
        };
    }
    componentDidUpdate(prevProps){
        const {item={}, list=[],verify,value} = this.props;
        if(item.error&&list&&list.length){
            funverify({ value, verify, item });
        }
    }
    // setValue=(value='')=>{
    //     this.setState({value});
    // }
    handleCheck = (e) => {
        const { onChange,checked=false} = this.props;
        onChange && onChange(!checked)
        // let { checked } = this.state;
        // this.setState({ checked: !checked }, () => {
        //     console.log('this.state.checked',this.state.checked);
        //     onChange && onChange(this.state.checked)
        // })
    }
    radioChange=(val,index)=>{
        const {onChange,item, verify,value,not_change} = this.props;
        if(val===value||not_change){
            return
        }
        item.error=false;
        // funverify({ val, verify, item });
        onChange&&onChange(val,index);
    }
    render(props, state) {
        const {list=[],item = {},t,id,loading=false,value='' , not_change=false} = this.props;//not_change 现在的这个不能修改，数据默认只有一条
        return <div className={classNames(styles.method,item.error && styles.error)} id={id}>
        <ul className={styles.methodList}>
            {loading?<li><i className={styles.loading}></i></li>:
            list&&list.length>0?(list.map((it,index)=>{
                return (<li key={index} onClick={this.radioChange.bind(this,it.shipping_rate_id,index,it)}>
                <div>{not_change?<span className={styles.radiotext}>{it.name}</span>:<Sradio className={styles.radio} checked={value === it.shipping_rate_id}><span className={styles.radiotext}>{it.name}</span></Sradio>}</div>
                <div className={styles.price}>{(it.price*1)>0?`${currencySymbol()}${it.price}`:t('Free')}</div>
            </li>)
            })):<div>
            <span className={styles.car}><svg viewBox="0 0 20 20" style={{ width: '1.45rem' }}><path fill="#e32c2b" opacity="0.3" d="M11 4h5l3 5h-8z"></path><path fill="#e32c2b" d="M17.816 14c-.415-1.162-1.514-2-2.816-2s-2.4.838-2.816 2H12v-4h6v4h-.184zM15 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM5 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM2 4h8v10H7.816C7.4 12.838 6.302 12 5 12s-2.4.838-2.816 2H2V4zm13.434 1l1.8 3H12V5h3.434zm4.424 3.485l-3-5C16.678 3.185 16.35 3 16 3h-4c0-.552-.448-1-1-1H1c-.552 0-1 .448-1 1v12c0 .552.448 1 1 1h1.185C2.6 17.162 3.698 18 5 18s2.4-.838 2.816-2h4.37c.413 1.162 1.512 2 2.814 2s2.4-.838 2.816-2H19c.552 0 1-.448 1-1V9c0-.18-.05-.36-.142-.515z"></path></svg></span>
            <span className={styles.text}>{t('shippingMethod.noAvailable')}</span>
        </div>}
        </ul>
    </div>
    }
}

export default Index;