
import React, { Component } from "react";
import styles from './style.module.scss';
// import classNames from 'classnames';
import { loadscript, trigger } from "../../../utils"
import Pubsub from "../../../utils/pubsub";
import { get_client_token } from "../../../api/api"
class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
            loading: true,
            client_token: '',
            category: '',
            on_payment_gate_way: '',
        }
    }
    UNSAFE_componentWillMount() {
        loadscript({ url: 'https://x.klarnacdn.net/kp/lib/v1/api.js', isPreload: true })
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextState) {//
        let { on_payment_gate_way } = this.state;
        let { payment_gate_way, payment_method } = nextProps.formData || {};//cards
        if (nextProps?.parentState?.onGateWayItem?.payPrice === 0) {//0元购直接通过
            this.setState({ loading: false });
        } else {
            if (payment_method === "Klarna" && on_payment_gate_way !== payment_gate_way) {//首次选中klarna时候
                loadscript({ url: 'https://x.klarnacdn.net/kp/lib/v1/api.js', id: 'klarna' }, () => {
                    this.getToken();
                })
            }
            if (payment_gate_way !== on_payment_gate_way) {
                this.setState({ on_payment_gate_way: payment_gate_way, on_payment_method: payment_method });
            }
        }
    }
    getToken = () => {
        get_client_token().then(res => {
            let { client_token, category } = res || {};
            this.setState({ client_token, category }, () => {
                this.initData()
            })
        }).catch(() => {
            let { on_payment_gate_way } = this.state;
            this.setState({ client_token: '', category: '' }, () => {
                Pubsub.publish('setPaymentLoadError', { type: on_payment_gate_way });//告诉父组件
            });
        }).finally(err => {
            this.setState({ loading: false });
        })
    }
    
    initData = () => {
        let { client_token = '', category = '' } = this.state;
        let str = client_token ? client_token.substring(client_token.length - 6) : '';
        try {
            Klarna.Payments.init({ client_token });
            Klarna.Payments.load({
                container: "#klarna-payments-container",
                payment_method_category: category//pay_later/bay_now/direct_bank_transfer/direct_debit/pay_over_time
            }, {
            }, (res) => {//回调
                let { show_form } = res || {};
                if (!show_form) {
                    trigger('CheckoutKlarnaError', { client_token: str, type: 'show_form' });
                }
                console.log('Klarna_init/load', res);//show_form: true周一(8/30)确认是是啥意思
            })
        } catch (e) {
            let { on_payment_gate_way } = this.state;
            // Handle error. The load~callback will have been called
            // with "{ show_form: false }" at this point.
            console.log('Klarna_init/load_catch', e);
            trigger('CheckoutKlarnaError', { client_token: str, type: 'catch' });
            this.setState({ client_token: '', category: '' }, () => {
                Pubsub.publish('setPaymentLoadError', { type: on_payment_gate_way });//告诉父组件
            });
        }
    }
    getCreditCardData = async (callback) => {
        if (this.props.parentState?.onGateWayItem?.payPrice === 0) {
            //0元购直接通过
            return callback({})
        }
        try {
            let { category } = this.state;
            Klarna.Payments.authorize({
                payment_method_category: category
            }, { // Data to be updated
            }, (res) => { // authorize~callback
                // ...
                console.log('authorize~callback', res);
                let { authorization_token = '', finalize_required, approved, show_form } = res || {};
                if (authorization_token && approved && show_form) {//成功
                    callback({ authorization_token });
                } else {
                    if (finalize_required && approved && show_form) {//还需要调用finalize
                        Klarna.Payments.finalize({
                            payment_method_category: category
                        }, { // Data to be updated
                        }, (r) => { // finalize~callback
                            // ...
                            console.log('finalize~callback', r);
                            let { authorization_token = '', approved, show_form } = r || {}
                            if (authorization_token && approved && show_form) {
                                callback({ authorization_token });
                            } else {
                                callback();
                            }
                        })
                    } else {
                        callback();
                    }
                }
            })
        } catch (e) {
            console.log('KlarnaAuthorizecatch', e);
            callback();
            // Handle error. The authorize~callback will have been called
            // with "{ show_form: false, approved: false }" at this point.
        }
    }
    render() {
        let { t = {}, backText, } = this.props;
        let { loading } = this.state;
        return (
            <div>
                {loading ? <div className={styles.isloading}><i className='s-icon-loading' /></div> : null}
                <div id="klarna-payments-container"></div>
            </div>
        );
    }
}

export default Index;