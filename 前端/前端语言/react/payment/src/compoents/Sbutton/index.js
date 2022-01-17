/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component,createRef} from "react";
import classNames from 'classnames';
import styles from './style.module.scss';
class Index extends Component {
    constructor(props) {
        super();
        this.state = {
        };
        this.input = createRef();
    }
    handleCheck = (e) => {
        const { onChange,checked=false} = this.props;
        onChange && onChange(!checked)
        // let { checked } = this.state;
        // this.setState({ checked: !checked }, () => {
        //     console.log('this.state.checked',this.state.checked);
        //     onChange && onChange(this.state.checked)
        // })
    }
    onChange=(e)=>{
        // console.log('Scheckbox',e);
    }
    render(props, state) {
        const {children, disabled=false,loading=false,type='',className={},onClick,id,style } = this.props;//type:''、'primary'
    return <button style={style} id={id}onClick={onClick} disabled={loading||disabled} className={classNames(styles['s-button'],type?styles[`s-button-${type}`]:null,loading&&styles.isLoading,className)} type="button"><span className={styles.text}>{loading&&<i className='s-icon-loading'/>}{children}</span></button>
    }
}

export default Index;