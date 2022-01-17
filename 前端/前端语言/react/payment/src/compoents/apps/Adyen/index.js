/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import { BillingAddress } from "../index"
import { Sinput } from '../../index';
import './style.css';
import styles from './style.module.scss';
let checkout = {};
class Index extends Component {
	constructor({ t }) {
		super();
		this.card = {};
		this.state = {
			cardholder_name:'',
			formItem: [
				{ name: 'cardholder_name', type: 'formDataInput', placeholder: t('paymentMethod.creditCard.cardHolderName'), verify: [{ required: true }] },
			],
		};
	}
	initCountry = (data = {}) => {
		this.refs.BillingAddress && this.refs.BillingAddress.initCountry(data);
	}
	handleOnChange = (state = {}, component) => {
		console.log('handleOnChange', JSON.stringify(state.data));
	}
	handleOnAdditionalDetails = (state = {}, component) => {
		console.log('handleOnAdditionalDetails', JSON.stringify(state.data));
	}
	getCreditCardData = async (callback) => {//外部调用触发提交
		this.card.submit();
		let { t } = this.props
		let { isValid = false, data = {} } = this.card;
		let {cardholder_name,formItem } = this.state;
		formItem[0].error = !cardholder_name;
		this.setState({ formItem });
		if (isValid&&cardholder_name) {
			data.paymentMethod.holderName=cardholder_name;
			callback && callback({cardData: data.paymentMethod});
		} else {
			callback && callback(false);
			return undefined
		}
	}
    setCardholder_name=(formData)=>{//用户外部修改Shipping address触发
        let cardholder_name=`${formData.first_name||''} ${formData.last_name||''}`;
		cardholder_name&&(cardholder_name=cardholder_name.trim());
        this.sinputChange('cardholder_name', cardholder_name);
    }
	sinputChange = (type, cardholder_name) => {
		this.setState({ cardholder_name });
	}
	renderAdycn = async() => {
		// const {paymentMethodsResponse}=this.state;
		let { publicKey = '',t,formData } = this.props || {};
		// const { adyenOriginKey=''} = originKeys;
		const configuration = {
			// showPayButton: true,

			// hasHolderName: true,
			// holderNameRequired: true,
			locale: "en_US", // The shopper's locale. For a list of supported locales, see https://docs.adyen.com/checkout/components-web/localization-components.
			environment: "live-us", // When you're ready to accept live payments, change the value to one of our live environments https://docs.adyen.com/checkout/components-web#testing-your-integration.  
			originKey:publicKey||'',//:'pub.v2.8215916698031269.aHR0cDovL2xvY2FsaG9zdDo1MDAw.BRn311Wm3vsCfss1sFg27lYAwppSPDcyopMli93tcpE', // Your website's Origin Key. To find out how to generate one, see https://docs.adyen.com/user-management/how-to-get-an-origin-key.
			onAdditionalDetails: this.handleOnAdditionalDetails,
			placeholders:{
				encryptedCardNumber: t('paymentMethod.creditCard.cardNumber'),
				encryptedSecurityCode:t('paymentMethod.creditCard.CVC'),
				// holderName:t('paymentMethod.creditCard.cardHolderName'),
			}
			// billingAddressRequired:true
			// paymentMethodsResponse, // The payment methods response returned in step 1.
			// onSubmit: this.handleOnChange, // Your function for handling onChange event
		};
		await(checkout = new AdyenCheckout(configuration));
		this.card = checkout.create('card').mount('#component-container');
        this.setCardholder_name(formData);
	}
	// renderAction=(action)=>{
	// 	checkout.createFromAction(action).mount('#my-container');
	// }
	render(props, state) {
		const { t,theme} = this.props;
		const { formItem = {}, cardholder_name } = this.state;
		return <div>
			<div id="component-container" className='component-container' style={{ padding: '0.93em' }}></div>
				{formItem.map(item => {
					return <div className={styles.inputParent} key={item.name}>
						<Sinput theme={theme} id={item.name} onChange={this.sinputChange.bind(this, item.name)} type={item.types} value={cardholder_name} placeholder={item.placeholder} verify={item.verify} item={item} />
					</div>
				})}
			{/* <div style={{padding: '0 10px'}}><BillingAddress t={t} ref="BillingAddress" /></div> */}
		</div>
	}
}

export default Index;