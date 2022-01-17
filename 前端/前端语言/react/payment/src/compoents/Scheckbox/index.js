/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component,createRef  } from "react";
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
        const {children, placeholder,checked=false,id,style={} } = this.props;
        return <form>
        <div className={styles.box} onClick={this.handleCheck} style={style}>
            <input id={id} type="checkbox" onChange={this.onChange} className={classNames(styles.checkbox,checked&&styles.ischecked)} checked={checked} placeholder={placeholder||null}></input>
            <span>{children}</span>
        </div>
    </form>
        
    }
}

export default Index;