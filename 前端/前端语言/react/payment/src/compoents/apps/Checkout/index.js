/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import { } from "../../../api/api"
// import { loadscript } from "../../../utils"
import { Sinput } from '../../index';
import classNames from 'classnames';
import styles from './style.module.scss';
import { Stooltip, Sicon, Smodal } from '../../index';
import { CreditTitle, CvvTip } from "../index"
import Checkout from "./checkout"
let { shop = {}} = window.shopify_checkouts || {};
let { platform_name } = shop || {};
let showArr=['HARBOR','SHOPIFY'];
let showCardName=showArr.includes(platform_name);
class Index extends Component {
	constructor({ t }) {
		super();
		this.state = {
			pm: '',
			valid: {
				'card-number': { isValid: true, isEmpty: true, placeholder: "tess ff", message: t('paymentMethod.creditCard.cardNumberInvalid') },
				'expiry-date': { isValid: true, isEmpty: true, message: t('paymentMethod.creditCard.expiryDateInvalid') },
				'cvv': { isValid: true, isEmpty: true, message: t('paymentMethod.creditCard.cvcInvalid') },
			},
			isOk: '',//是否符合提交条件
			loading: true,//页面加载中
			formItem: [
				{ name: 'cardholder_name', type: 'formDataInput',isHide:!showCardName, placeholder: t('paymentMethod.creditCard.cardHolderName'), verify: [{ required: true }] },
			],
			cardholder_name: '',
			languageJson: {
				English: 'EN-GB',
				Dutch: 'NL-NL',
				French: 'FR-FR',
				German: 'DE-DE',
				Italian: 'IT-IT',
				Korean: 'KR-KR',
				Spanish: 'ES-ES',
				en: 'EN-GB',
				fr: 'FR-FR',
				es: 'ES-ES',
			},
			visible: false
		};
		this.token = ''
	}
	initCountry = (data = {}) => {
		this.refs.BillingAddress && this.refs.BillingAddress.initCountry(data);
	}
	getCreditCardData = async (callback) => {
		this.refs.Checkout && this.refs.Checkout.getCreditCardData(callback);
	}
	setCardholder_name = (formData) => {//用户外部修改Shipping address触发
		this.refs.Checkout && this.refs.Checkout.setCardholder_name(formData);
	}
	render(props, state) {
		const { t, onChange, parentState, theme } = this.props;
		const { originKeys = {},formData } = parentState;
		const { checkoutPublicKey } = originKeys;
		const { payment_gate_way } = formData || {};// eslint-disable-line
		const { pm, loading, formItem = {}, cardholder_name, visible } = this.state;
		let isActive = (payment_gate_way === 'credit')
		let { order = {} } = window.shopify_checkouts || {};
		let { language = 'en' } = order || {};
		let isRtl = (language === 'ar');
		// let isMobile = document.body.clientWidth < 750;
		return <ul className={classNames(styles.collapse, theme && styles[theme], isRtl ? styles._rtl : '')}>
			<li className={styles.cardBox}>
				<CreditTitle formData={formData} direction='column' theme={theme} onClick={() => { onChange && onChange('payment_gate_way', 'credit') }} hasRadio={true} isActive={isActive} t={t} title={t('paymentMethod.creditCard.label')} icon={'Checkout_credit'} />
				<div className={classNames(styles.collapseTMain, !isActive && styles.hidden)}>
					<Checkout ref='Checkout' {...this.props}  publicKey={checkoutPublicKey}/>
				</div>
			</li>
			{/* <li>
                <div>
                    <CreditTitle theme={theme} formData={formData} onClick={() => { onChange && onChange('payment_gate_way', 'knet') }} hasRadio={true} isActive={payment_gate_way === 'knet'} t={t} title={'KENT'} icon={'knet'} />
                </div>
            </li>
			<li>
                <div>
                    <CreditTitle theme={theme} formData={formData} onClick={() => { onChange && onChange('payment_gate_way', 'qpay') }} hasRadio={true} isActive={payment_gate_way === 'qpay'} t={t} title={'QPay'} icon={'qpay'} />
                </div>
            </li> */}
		</ul>

	}
}

export default Index;