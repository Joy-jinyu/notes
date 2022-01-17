/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component, createRef } from "react";
import { withTranslation } from "react-i18next";
import classNames from 'classnames';
import styles from './style.module.scss';
import { Sradio, Smodal } from '../index'
import Pubsub from "../../utils/pubsub"
import { reportSurvey } from "../../api/api"
import { gtmTrigger } from "../../utils"
let { shop = {} } = window.shopify_checkouts || {};
const { name = '' } = shop || {};
let isvv_jp=!!(name && name.toLocaleLowerCase() === 'vivaiacollection_jp');
let subFalg = false;//控制按钮
class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
            status: 0,//0显示连接，1显示提交框，2什么都不显示
            subDisabled: false,
            issueContent: '',
            modalVisible: false,
            isError: false,
            onIndex: null,//当前选中的项
            list: [
                { label: t('Feedback.NoPayment'),enLabel:'No payment method I want.', placeholder: t('Feedback.TellUs'), required: false,messageType:1 },
                { label: t('Feedback.notSupported'),enLabel:'My credit card is not supported.', placeholder: t('Feedback.favoriteCard'), required: false,messageType:1 },
                { label: t('Feedback.shippingModified'),enLabel:'The shipping address cannot be modified.', placeholder: t('Feedback.fillMore'), required: false,messageType:1 },
                { label: t('Feedback.ErrorSubPayment'),enLabel:'Error submitting payment, unable to continue.', placeholder: t('Feedback.fillError'), required: false,messageType:1 },
                { label: t('Feedback.UnfriendlyPage'),enLabel:'Unfriendly payment page.', placeholder: t('Feedback.WhereNotGood'), required: false,messageType:1 },
                { label: (isvv_jp?'VIVAIAのお支払いページを信用できない':t('Feedback.Distrust')),enLabel:"I don't trust this payment page.", placeholder: t('Feedback.tellDistrust'), required: false,messageType:1 },
                { label: t('Feedback.Other'),enLabel:'Other', placeholder: '', required: true,messageType:2 },
            ],
            trigger:0
        };
        this.textarea = createRef();
    }
    componentDidMount() {

        //外部触发弹窗
        this.PubSetVisible = Pubsub.subscribe('setFeedbackVisible', (type, data) => {
            console.log('type, data',type, data);
            this.changeModalVisible(true,data)
        });
    }
    setCardholder_name = (formData) => {//获取userName
        let cardholder_name = `${formData.first_name || ''} ${formData.last_name || ''}`;
        cardholder_name && (cardholder_name = cardholder_name.trim());
        return cardholder_name
    }
    onSubmit = (e) => {
        let { onIndex, list,trigger } = this.state;
        let { formData,callback } = this.props;
        let { enLabel, contentDetail, required,messageType } = list[onIndex] || {};
        if(trigger===1){//上报通过返回触发的选项
            gtmTrigger({ eventAction: 'payment_action',eventLabel: `Leave_${enLabel||''}` });
        }
        if(trigger===1&&onIndex===null){//如果是直接点击的返回且没有选中的情况 就直接触发返回
            callback&&callback();
            return
        }
        let isEr=(required && !contentDetail)||onIndex===null;
        if (subFalg || isEr) {
            if (isEr) {
                this.setState({ isError: true });
                setTimeout(() => {
                    if (this.state.isError) {
                        this.setState({ isError: false });
                    }
                }, 1000)
            }
            return
        };
        
        const {postal_code}=formData||{};
        if(postal_code==='888888' || postal_code === '8888888'){//防止测试提交的
            subFalg = false;
            this.setState({ modalVisible: false,subLoading: false });
            (trigger===1)&&callback&&callback();
            return
        }
        subFalg = true;
        this.setState({ subLoading: true });
        const { order,shop } = window.shopify_checkouts;
        const { trans_id: transId } = order || {}
        const { platform,domain } = shop || {}
        const { email, country: countryCode } = formData || {};
        let userName = this.setCardholder_name(formData);
        reportSurvey({ trigger,messageType,platform,domain,userName, email, issueContent: (onIndex === 6 ? contentDetail : enLabel), contentDetail: (onIndex === 6 ? '' : contentDetail), transId, countryCode }).then(res => {
            list[onIndex].contentDetail='';
            this.setState({ modalVisible: false, list });
        }).catch(e => {
            console.log('e', e);
        }).finally(e => {
            subFalg = false;
            this.setState({ subLoading: false });
            (trigger===1)&&callback&&callback()
        })
    }
    changeModalVisible = (vis = false,data={}) => {
        const {trigger=0}=data||{};
        if((trigger===1)&&(vis!==true)){//返回触发的
            gtmTrigger({eventAction: 'payment_action', eventLabel: "Stay in Checkout" });
        }else if((trigger!==1)&&(vis===true)){//主动点开的时候触发
            gtmTrigger({eventAction: 'payment_action', eventLabel: "payment issues button" });
        }
        this.setState({ modalVisible: vis,trigger:trigger===1?1:0 }, () => {
            if (vis && this.textarea?.focus) {
                setTimeout(() => {
                    this.textarea.focus();
                })
            }
        });
    }
    textareaChange = (index, e) => {
        let { list } = this.state;
        list[index].contentDetail = e.target.value;
        this.setState({ list });
    }
    radioChange = (onIndex) => {
        this.setState({ onIndex }, () => {
            if (this.textarea && this.textarea?.focus) {
                setTimeout(() => {
                    this.textarea.focus();
                })
            }
        })
    }
    render(props) {
        let { modalVisible, subLoading, isError, list = [], onIndex,trigger=0 } = this.state;
        let { t } = this.props;
        return <div className={styles.feedback}>
            <div className={classNames(styles.main, styles.link)} onClick={this.changeModalVisible.bind(this, true,{trigger})}>{t('paymentIssues')}</div>
            <Smodal columnBtn={trigger===1} title={trigger===1?`${t('Leaving')}?`:''} className={styles.modal} type="confirm" visible={modalVisible} onOk={this.onSubmit} onCancel={this.changeModalVisible.bind(this, false,{trigger})} onClose={this.changeModalVisible.bind(this, false,{trigger})} cancelText={t(trigger===1?'StayCheckout':'CANCEL_big')} okText={t(trigger===1?'SubmitLeave':'submit')} okLoading={subLoading}>
                {trigger===1&&<div className={styles.text}>{t('submitReason')}</div>}
                <ul className={styles.main}>
                    {list.map((it, index) => {
                        return <li key={index}>
                            <Sradio onChange={this.radioChange.bind(this, index)} className={classNames(styles.radio,(onIndex===null&&isError)?styles.isError:{})} checked={onIndex === index}><span className={styles.radiotext}><span>{`${index + 1}. `}&nbsp;</span><span>{it.label}</span></span></Sradio>
                            {onIndex === index && <div className={classNames(styles.textareaBox,isError?styles.isError:{})}><textarea ref={e => this.textarea = e} value={(list[index] && list[index].contentDetail) || ''} rows="6" maxLength={200} placeholder={it.placeholder} onChange={this.textareaChange.bind(this, index)}></textarea>{it.required ? <i> *</i> : null}</div>}
                        </li>
                    })}
                </ul>
            </Smodal>
        </div>
    }
}

export default (withTranslation()(Index));