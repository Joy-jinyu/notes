/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import { } from "../../../api/api"
import { loadscript } from "../../../utils"
import { Sinput } from '../../index';
import classNames from 'classnames';
import styles from './style.module.scss';
import { Stooltip, Sicon, Smodal } from '../../index';
import { CreditTitle, CvvTip } from "../index"
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
	componentDidMount() {
		loadscript({url:'https://cdn.checkout.com/js/framesv2.min.js',id:'checkout'}, () => {
			this.renderScriput();
		})
	}
	initCountry = (data = {}) => {
		this.refs.BillingAddress && this.refs.BillingAddress.initCountry(data);
	}
	FramesInit = async () => {
		const { parentState, t,publicKey } = this.props;
		const { gatewayCountryLoading = false, } = parentState;
		const { languageJson } = this.state;
		try {
			await window.Frames.init({
				publicKey, localization: {
					cardNumberPlaceholder: t('paymentMethod.creditCard.cardNumber'),
					expiryMonthPlaceholder: "MM",
					expiryYearPlaceholder: "YY",
					cvvPlaceholder: t('paymentMethod.creditCard.CVC'),
				}
			});
		} catch (error) {
			
		}
		// await Frames.init({ publicKey: checkoutPublicKey, localization: languageJson[currentLng] || 'EN-GB' });
		// await Frames.init({publicKey:publicKey || "pk_test_61801af3-d323-44f9-a42a-82669df3bdcb"});
	}
	renderScriput = async () => {
		var form = document.getElementById("payment-form");
		const { parentState,publicKey } = this.props;
		const { formData, originKeys = {}, gatewayCountryLoading = false, } = parentState;
		if (!publicKey) { return };
		await this.FramesInit();
		this.setState({ loading: false });
		this.setCardholder_name(formData);
		window.Frames.addEventHandler(
			window.Frames.Events.CARD_VALIDATION_CHANGED,
			(event) => {
				this.setState({ isOk: window.Frames.isCardValid() })
			}
		);

		window.Frames.addEventHandler(//字段的验证状态更改时触发。使用它来显示错误消息或更新UI。
			window.Frames.Events.FRAME_VALIDATION_CHANGED,
			(event) => {
				let { element, isEmpty, isValid } = event || {};
				let { valid } = this.state;
				console.log('isEmpty, isValid', isEmpty, isValid);
				if (isEmpty || isValid) {
					valid[element].isValid = true;
				} else {
					valid[element].isValid = isValid;
				}
				valid[element].isEmpty = isEmpty;
				this.setState({ valid });
			}
		);
		window.Frames.addEventHandler(//根据输入的卡号检测到有效的付款方式时触发。使用此事件来更改卡图标。
			window.Frames.Events.PAYMENT_METHOD_CHANGED,
			(event) => {
				var pm = event.paymentMethod;
				pm = (pm ? pm.toLowerCase() : '');
				this.setState({ pm })
			}
		);

		// Frames.addEventHandler(
		// 	Frames.Events.CARD_TOKENIZED,
		// 	(event) => {
		// 		console.log('CARD_TOKENIZED',event);
		// 		this.token = event.token;
		// 		return event.token
		// 	}
		// );
		form.addEventListener("submit", function (event) {
			event.preventDefault();
			Frames.submitCard();
		});
	}
	getCreditCardData = async (callback) => {
		const { parentState } = this.props;
		const { formData } = parentState;
		const { payment_gate_way } = formData || {};// eslint-disable-line
		if (payment_gate_way.includes('credit')) {
			let checkoutData = {};
			let { cardholder_name, isOk, formItem } = this.state;
			if (!isOk || !cardholder_name) {
				const { valid } = this.state;
				Object.keys(valid).forEach(key => {
					if (valid[key].isEmpty) {
						valid[key].isValid = false;
					}
				});
				if(!formItem[0].isHide){
					formItem[0].error = !cardholder_name;
				}
				this.setState({ valid, formItem });
				callback && callback(false);
				return false;
			};
			Frames.cardholder = {
				name: cardholder_name,
			};
			await Frames.submitCard().then((data = {}) => {
				checkoutData = data;
				console.log('data', data, { checkoutData, cardholder_name });
				callback && callback({ payment_method: 'Checkout', checkoutData, cardholder_name });
			}).catch(e => {
				console.log('submitCard error', e);
				callback(false);
				return false;
			});
			Frames.enableSubmitForm()//保留输入的卡详细信息并允许您重新提交付款表格。
			// await this.FramesInit();
			const { valid } = this.state;
			Object.keys(valid).forEach(key => {
				valid[key].isEmpty = true;
			});
			return checkoutData.token ? { checkoutData, cardholder_name } : false;
		} else {
			callback({ payment_method: 'Checkout' })
		}
	}
	isError = (type) => {
		const { valid } = this.state;
		if (valid[type] && !valid[type].isValid) {
			return valid[type].message
		} else {
			return false
		}
	}
	setCardholder_name = (formData) => {//用户外部修改Shipping address触发
		let cardholder_name = `${formData.first_name || ''} ${formData.last_name || ''}`;
		cardholder_name && (cardholder_name = cardholder_name.trim());
		this.sinputChange('cardholder_name', cardholder_name);
	}
	sinputChange = (type, cardholder_name) => {
		this.setState({ cardholder_name });
	}
	setvisible = (visible) => {
		this.setState({ visible })
	}
	card_logo = (pm) => {
		let arr = {visa:'visa','american express':'amex','diners club':'dinersclub','discover':'discover','jcb':'jcb','mastercard':'mastercard','maestro':'maestro','mada':'mada'};//我们目前有的卡
		let type=arr[pm];
		if (type) {
			return <Sicon className={styles.card_icon} icon={type} />
		} else {
			return <Sicon className={styles.card_icon} icon={'card_number'} />;
		}
	}
	render(props, state) {
		const { t, onChange, parentState, theme } = this.props;
		const { pm, loading, formItem = {}, cardholder_name, visible } = this.state;
		let safety = <Sicon className={styles.card_icon} icon='safety' />;
		let isMobile = document.body.clientWidth < 750;
		return <div className={theme&&styles[theme]}>
			<form id="payment-form" method="POST" action="https://merchant.com/charge-card">
						<div className={styles.card_box}>
							<div className={styles.card_top}>
								<label className={classNames(styles.cardNumber)}>
									<div className={styles.card_img_box}>
										<div className={styles.card_img}>
											{this.card_logo(pm)}
										</div>
									</div>
									<div className={classNames("card-number-frame", styles.inputBox)}></div>
									<div className={styles.icon_box}>
										{isMobile ? <div className={styles.svgLock} onClick={(e) => {e.preventDefault(); this.setvisible(true) }}>
											{safety}
										</div> : <Stooltip style={{ whiteSpace: 'nowrap' }} title={t('paymentMethod.subLabel')}>
												<div className={styles.svgLock}>
													{safety}
												</div>
											</Stooltip>}
									</div>
									{this.isError('card-number') ? <span className={styles.errortext}>{this.isError('card-number')}</span> : ''}
								</label>
								<Smodal visible={visible} onOk={() => { this.setvisible(false) }}>
									<div className={styles.textBox}>{t('paymentMethod.subLabel')}</div>
								</Smodal>
							</div>
							<div className={styles.card_bottom}>
								<label className={classNames(styles.expiryDate)}>
									<div className={styles.card_img_box}>
										<div className={styles.card_img}>
											<Sicon className={styles.card_icon} icon='calendar' />
										</div>
									</div>
									<div className={classNames("expiry-date-frame", styles.inputBox)}></div>
									{this.isError('expiry-date') ? <span className={styles.errortext}>{this.isError('expiry-date')}</span> : ''}
								</label>
								<label className={classNames(styles.cvc)}>
									<div className={styles.card_img_box}>
										<div className={styles.card_img}>
											<Sicon className={styles.card_icon} icon='cvv' />
										</div>
									</div>
									<div className={classNames("cvv-frame", styles.inputBox)}></div>
									<div className={styles.icon_box}>
										<CvvTip t={t} />
									</div>
									{this.isError('cvv') ? <span className={styles.errortext}>{this.isError('cvv')}</span> : ''}
								</label>
							</div>
							{formItem.map(item => {
								if(!item.isHide){
									return <div className={styles.inputParent} key={item.name}>
										<Sinput theme={theme} className={styles.cardNumber} id={item.name} onChange={this.sinputChange.bind(this, item.name)} type={item.types} value={cardholder_name} placeholder={item.placeholder} verify={item.verify} item={item} />
									</div>
								}else{
									return null
								}
							})}
						</div>
					</form>
		</div>

	}
}

export default Index;