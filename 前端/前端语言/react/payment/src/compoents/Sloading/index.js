/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
class Index extends Component {
    constructor() {
        super();
        this.state = {
        };
    }
    render(props, state) {
        const {visible,meassge,t} = this.props;
        return visible?<div className='_spinner_'>
        <div className='spinWrap'>
            <p className='spinnerImage'></p>
            <p className='loader'></p>
            <p className='loadingMessage' id="spinnerMessage">{meassge || ''}</p>
        </div>
    </div>:null
    }
}

export default Index;