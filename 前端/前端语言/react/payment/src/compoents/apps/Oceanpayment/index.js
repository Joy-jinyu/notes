/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import { ocean_payment_get } from "../../../api/api"
import { Sbutton } from '../../index';
import sha256 from 'js-sha256';
import styles from './style.module.scss';

let status = 0;
const DOMAIN = process.env.DOMAIN || '';
const isProd=(process.env.NODE_ENV==='production');
// const isProd=DOMAIN.includes('checkout.starservices.store');
class Index extends Component {
	constructor({ t }) {
		super();
		this.state = {
			loading: true,//页面加载中
			tryIt:false,
			payment_id:'',
			formItem: [
				{ name: 'cardholder_name', type: 'oceanDataInput', placeholder: t('paymentMethod.creditCard.cardHolderName'), verify: [{ required: true }] },
			],
			cardholder_name: '',
			oceanData: {
				account: '140105',//账户号
				terminal: '140105103',//终端号
				backUrl: `https://${DOMAIN}/payment/ocean_payment_back_url`,//返回支付信息的网站URL地址,用于浏览器跳转
				noticeUrl: `https://${DOMAIN}/webhook/ocean_payment_notify_url`,//服务器回调URL地址，用于交易结果推送及其他业务状态推送
				methods: 'Credit Card',//固定值
				pages: 1,//0: PC端 (默认)、1: 移动端
				order_number: '',//订单号
				order_currency: 'USD',//币种
				order_amount: 0,//金额
				order_notes: 'uuid',//订单备注信息，返回时则原样返回(可选)
				billing_firstName: '',//消费者
				billing_lastName: '',//消费者
				billing_email: '',//消费者
				// billing_phone:'13800138000',//可选
				billing_country: '',
				// billing_state:'AS',//州（省、郡）可选
				// billing_city:'Washington D.C.',//城市 可选
				// billing_address:'705A big Road',//705A big Road 可选
				// billing_zip:'529012',//邮编 可选
				// ship_firstName:'Vergil',//收货人的名 可选
				// ship_lastName:'Vergil',//收货人的姓 可选
				// ship_phone:'13800138000',//收货人电话 可选
				// ship_country:'US',//收货人的国家 可选
				// ship_state:'AL',//收货人的州（省、郡） 可选
				// ship_city:'Washington D.C.',//收货人的城市 可选
				// ship_addr:'705A big Road',//收货人的详细地址 可选
				// ship_zip:'529012',//收货人的邮编 可选
				productSku: '',//产品SKU，多个产品用,隔开
				productName: '',//产品名称，多个产品用,隔开
				productNum: 0,//产品数量，多个产品用,隔开
				productPrice: 0,//产品单价，多个产品用,隔开
				// cart_info:'PC',//设备终端类型：PC、Wap、Android、iOS
				// cart_api:'V1.8.6',//接口版本
				// logoUrl:'V1.8.6',//用于显示在支付页面上的logo URL
				cssUrl:`https://${DOMAIN}/checkout/oceanpay.css`,//css样式必须为https://协议开头
			}
		};
	}
	componentDidMount() {
		// loadscript({url:'https://cdn.checkout.com/js/framesv2.min.js',id:'checkout'}, () => {
		// 	this.renderScriput();
		// })
	}
	getCreditCardData = async (callback) => {
		const { oceanData,payment_id } = this.state;
		callback && callback({ payment_method:'Ocean',order_number: oceanData.order_number,payment_id })
	}
	setCardholder_name = (oceanData) => {//用户外部修改Shipping address触发
	}
	sinputChange = (type, cardholder_name) => {
		this.setState({ cardholder_name });
	}
	renderForm = (callback) => {
		let { order = {} } = window.shopify_checkouts || {};
		let { currency, all_price, uuid, items, total_quantity = 0,language } = order;
		const { oceanData,tryIt } = this.state;
		if(tryIt){return};
		this.callback=callback;
		const { formData,originKeys = {},t } = this.props;
		const { oceanAccount,oceanTerminal,oceanSecureCode} = originKeys;
		const { first_name, last_name, email, country, } = formData;
		let productSku = [], productName = [], productPrice = [];
		items.forEach(item => {
			item.sku && productSku.push(item.sku);
			item.title && productName.push(item.title.slice(0, 40));
			item.price && productPrice.push(item.price);
		})
		let _this = this;
		let arr = ("account+terminal+backUrl+order_number+order_currency+order_amount+billing_firstName+billing_lastName+billing_email+secureCode").split('+');
		let val = '', dateString = new Date().getTime() + '';
		oceanData.account=oceanAccount;
		oceanData.terminal=oceanTerminal;
		oceanData.order_number = `${uuid.slice(-5)}${dateString}`;
		oceanData.backUrl = `${oceanData.backUrl}?order_number=${oceanData.order_number}`;
		oceanData.order_currency = currency;
		oceanData.order_amount = all_price;
		oceanData.order_notes = uuid;
		oceanData.billing_firstName = first_name.trim();
		oceanData.billing_lastName = last_name.trim();
		oceanData.billing_email = email.trim();
		oceanData.billing_country = country;
		oceanData.productSku = productSku.toString();
		oceanData.productName = productName.toString();
		oceanData.productNum = total_quantity;
		oceanData.productPrice = productPrice.toString();
		oceanData.language = language||'en_US';
		arr.forEach(key => {
			oceanData[key] && (val = val + oceanData[key]);
		})
		val = val + oceanSecureCode;//oceanSecureCode测试环境是12345678
		console.log('val',val);
		oceanData.signValue = sha256(val);
		console.log('oceanData',oceanData);
		this.setState({ oceanData }, () => {
			this.refs.oceanpaymentCreditcard.submit()
			// $("#oceanpayment_creditcard").submit();
		});
		status = 0;
		let upload_from_return=document.getElementById('upload_from_return');
		if(!upload_from_return){return};
		callback && callback('state',{ visible: true });
		upload_from_return.onload = function (e) {
			status++;
			console.log('status', status);
			switch (status) {
				case 1:
					callback && callback('state',{ visible: false });
					break;
				case isProd?3:2://正式环境会多一个loading页面
					//代表用户点了提交进入了loading
					callback && callback('state',{ visible: true });
					ocean_payment_get({ order_number: oceanData.order_number }).then(res => {
						const urlParams = (res && new URLSearchParams(res)) || '';
						let payment_status = urlParams.get("payment_status");
						let payment_details = urlParams.get("payment_details")||'';//错误信息
						let payment_id = urlParams.get("payment_id");
						if (payment_status === '1') {
							_this.setState({payment_id,tryIt:true});
							callback && callback();
						} else {
							if(payment_details&&!payment_details.includes('50008')){//50008代表用户取消
								alert(payment_details);
							}
							callback && callback('error');
						}
					}).catch(err => {
						console.log('err', err);
						callback && callback('error');
					});
					break;
				// case 3:
				// 	// status=0;
				// 	//status==3代表loading完成
				// 	break;
				default:
					if (status > (isProd?3:2)) {
						status = 0;
					}
			}
		}
	}
	render(props, state) {
		const { t,subLoading } = this.props;
		const { oceanData, loading,tryIt } = this.state;
		return <div className={styles.Oceanpayment}>
			<form acceptCharset="UTF-8" action={`https://secure.oceanpayment.com/gateway/service/${isProd?'pay':'test'}`} method="post" id="oceanpayment_creditcard" ref="oceanpaymentCreditcard" target="upload_from_return">
				{Object.keys(oceanData).map(key => {
					return <input key={key} type="hidden" name={key} value={oceanData[key]} />
				})}
			</form>
			{tryIt?<div className={styles.tryIt}><Sbutton type='green' onClick={this.callback} loading={subLoading}>{t('TryIt')}</Sbutton></div>:<iframe width="100%" height="100%" name="upload_from_return" title="navigation" id="upload_from_return"></iframe>}
		</div>

	}
}

export default Index;