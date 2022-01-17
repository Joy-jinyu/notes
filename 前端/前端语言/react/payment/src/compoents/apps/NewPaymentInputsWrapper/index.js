/*
 * @Author: yangj
 * @Date: 2020-03-03 14:35:11
 * @LastEditors: yangj
 */
import React, { useState, useEffect } from 'react';
import { PaymentInputsWrapper, usePaymentInputs, PaymentInputsContainer } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import { css } from 'styled-components';
import styles from './style.module.scss';
import classNames from 'classnames';
import { Stooltip, Smodal, Sicon, Sselect } from '../../index';
import { CvvTip } from '../../apps';
// import { funverify } from "../../../utils"

export default function PaymentInputs(props, ref) {
	const { card_number, expiry, cvc, cardFunverify, onChange, onError, placeholder, t, theme } = props;
	const ERROR_MESSAGES = {
		emptyCardNumber: t('paymentMethod.creditCard.cardNumberEnter'),
		invalidCardNumber: t('paymentMethod.creditCard.cardNumberInvalid'),
		emptyExpiryDate: t('paymentMethod.creditCard.expiryDateEnter'),
		monthOutOfRange: t('paymentMethod.creditCard.expiryDateMonthBe'),
		yearOutOfRange: t('paymentMethod.creditCard.expiryDatePast'),
		dateOutOfRange: t('paymentMethod.creditCard.expiryDatePast'),
		invalidExpiryDate: t('paymentMethod.creditCard.expiryDateInvalid'),
		emptyCVC: t('paymentMethod.creditCard.cvcEnter'),
		invalidCVC: t('paymentMethod.creditCard.cvcInvalid'),
	}
	let {
		wrapperProps,
		getCardImageProps,
		getCardNumberProps,
		getExpiryDateProps,
		getCVCProps,
		meta
	} = usePaymentInputs({ errorMessages: ERROR_MESSAGES });
	const initMMOptong = () => {
		let mm = [];
		let onmm = 1;
		mm.push({ code: '', name: t('paymentMethod.creditCard.Month') });
		while (mm.length < 13) {
			if (onmm < 10) {
				mm.push({ code: `0${onmm}`, name: `0${onmm}` });
			} else { mm.push({ code: `${onmm}`, name: `${onmm}` }) }
			onmm++;
		};
		return mm
	}
	const initYYOptong = () => {
		let yy = [];
		let onyy = new Date().getFullYear();
		yy.push({ code: '', name: t('paymentMethod.creditCard.Year') });
		while (yy.length < 30) {
			yy.push({ code: `${onyy}`.slice(-2), name: `${onyy}` });
			onyy++;
		};
		return yy
	}
	let yymm = [
		{ name: 'mm', type: 'select', placeholder: t('paymentMethod.creditCard.Month'), title: t('paymentMethod.creditCard.ExpirationDate'), option: initMMOptong(), verify: [{ required: true }], message: ERROR_MESSAGES.emptyExpiryDate },
		{ name: 'yy', type: 'select', placeholder: t('paymentMethod.creditCard.Year'), option: initYYOptong(), verify: [{ required: true }], message: ERROR_MESSAGES.emptyExpiryDate }
	]
	// const initLanguage = (erroredInputs) => {//修改语言
	// 	let arr = ['cardNumber', 'cvc', 'expiryDate'];
	// 	arr.forEach(key => {
	// 		if (erroredInputs[key]) {
	// 			if (erroredInputs[key].includes('Enter')) {//空的时候
	// 				erroredInputs[key] = t(`paymentMethod.creditCard.${key + 'Enter'}`)
	// 			} else if (erroredInputs[key].includes('is invalid')) {//错误的时候
	// 				erroredInputs[key] = t(`paymentMethod.creditCard.${key + 'Invalid'}`)
	// 			} else if (erroredInputs[key].includes('in the past')) {//日期过时的时候
	// 				erroredInputs[key] = t(`paymentMethod.creditCard.${key + 'Past'}`)

	// 			} else if (erroredInputs[key].includes('must be')) {//月错误的时候
	// 				erroredInputs[key] = t(`paymentMethod.creditCard.${key + 'MonthBe'}`)

	// 			}
	// 		}
	// 	})
	// }
	let { erroredInputs = {}, touchedInputs = {}, cardType } = meta || {};
	let { type } = cardType || {};
	// initLanguage(erroredInputs);
	let [onCardData, setonCardData] = useState({ card_number, expiry, cvc });//保存一份当前数据在本组件中
	const handleChange = (inputType, value) => {
		switch (inputType) {
			case 'card_number':
				if (value) {
					onChange && onChange('is_copy', false);
				}
				break;
			case 'cvc':
				let reg = new RegExp(/^\d{0,3}$/);
				if (type === "amex") {//如果是美国运通卡 就限制4位，否则3位
					reg = new RegExp(/^\d{0,4}$/);
				}
				if (!reg.test(value)) { return }
				break;
			default:
				break;
		}
		onCardData[inputType] = value;
		setonCardData(onCardData);
		onChange && onChange(inputType, value);
		onError && onError(erroredInputs);
	}
	const handleBlurChange = (inputType, value) => {//失去焦点再执行一次
		onCardData[inputType] = value;
		setonCardData(onCardData);
		onChange && onChange(inputType, value);
		onError && onError(erroredInputs);
	}
	const [yymmData, setyymmData] = useState({ yy: '', mm: '' });
	const isError = (type) => {
		if (type === 'mm' || type === 'yy') {
			let isEr = touchedInputs.expiryDate && !yymmData[type];
			let onItem = yymm.find(item => item.name === type) || {};
			if (isEr) {
				onItem.message = ERROR_MESSAGES.emptyExpiryDate;
			} else {//有值的情况验证是否过期
				let myDate = new Date();
				let tYear = myDate.getFullYear();
				let tMonth = myDate.getMonth() + 1;
				if ((2000+(yymmData.yy * 1)) === tYear && yymmData.mm * 1 < tMonth) {//等于当年
					isEr = true;
					onItem.message = ERROR_MESSAGES.invalidExpiryDate;
				}
			}
			onItem.error = isEr;
			return isEr
		} else {
			return touchedInputs[type] && erroredInputs[type]
		}
	}
	const failedCard = () => {
		if (meta.error) {
			touchedInputs.cardNumber = true;
			touchedInputs.expiryDate = true;
			touchedInputs.cvc = true;
		};
		return !!meta.error
	}
	if (cardFunverify) {
		failedCard()
	}
	let { order = {} } = window.shopify_checkouts || {};
	let { language = 'en' } = order || {};
	let isRtl = (language === 'ar');
	let safety = <Sicon className={styles.card_icon} icon='safety' />
	let isMobile = document.body.clientWidth < 750;
	const [visible, setvisible] = useState(false);
	const [cvVisble, setCvVisible] = useState(false);

	const init = (visible) => {
		if (visible) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'initial';
		}
	}

	useEffect(() => {
		init(visible);
	}, [visible])// eslint-disable-line
	const card_logo = () => {
		let arr = ['visa', 'amex', 'dinersclub', 'discover', 'jcb', 'mastercard', 'mada'];//我们目前有的卡
		if (arr.includes(type)) {
			return <Sicon style={{ width: '1.5em', height: '1em' }} icon={type} />
		} else {
			if (type) {
				return <svg {...getCardImageProps({ images })} />
			} else {
				return <Sicon style={{ width: '1.5em', height: '1.5em' }} icon={'card_number'} />;
			}
		}
	}
	const handlePaste = (inputType, value) => {
		setTimeout(() => {
			let { card_number } = onCardData || {};
			switch (inputType) {
				case 'card_number':
					if (card_number) {
						onChange && onChange('is_copy', true);
					}
					break;
				default:
					break;
			}
		})
	}
	const handleSelectChange = (inputType, value) => {
		let newyymmData = Object.assign({}, yymmData);
		newyymmData[inputType] = value;
		setyymmData(newyymmData)
	}

	useEffect(() => {
		let { yy, mm } = yymmData || {}
		let value = mm && yy ? `${mm} / ${yy}` : '';
		handleChange('expiry', value);// eslint-disable-next-line
	}, [yymmData]);
	return (
		<div className={classNames(styles.card_box, theme && styles[theme], isRtl ? styles._rtl : '', isMobile ? styles.card_mobile_box : '')}>
			<div className={styles.card_item}>
				<div className={styles.title}><span>{t('paymentMethod.creditCard.CardNo')} *</span></div>
				<label className={classNames(styles.cardNumber, isError('cardNumber') && styles.error)}>
					<div className={styles.card_img_box}>
						<div className={styles.card_img}>
							{card_logo()}
						</div>
					</div>
					<input {...getCardNumberProps({ onChange: (e) => { handleChange('card_number', e.target.value) }, onBlur: (e) => { handleBlurChange('card_number', e.target.value) }, onPaste: (e) => { handlePaste('card_number', e.target.value) } })} value={card_number} placeholder={t('paymentMethod.creditCard.cardNumber')} disabled={visible} />
					<div className={styles.icon_box}>
						{(!!card_number || card_number === '0') && <div className={styles.clearBox} onClick={() => { handleChange('card_number', '') }}><Sicon className={styles.card_icon} icon='clear' /></div>}
						{isMobile ? <div className={styles.svgLock} onClick={() => { setvisible(true) }}>
							{safety}
						</div> : <Stooltip style={{ whiteSpace: 'nowrap' }} title={t('paymentMethod.subLabel')}>
								<div className={styles.svgLock}>
									{safety}
								</div>
							</Stooltip>}
						<Smodal visible={visible} onOk={() => { setvisible(false) }}>
							<div className={styles.textBox}>{t('paymentMethod.subLabel')}</div>
						</Smodal>
					</div>
					<span className={styles.errortext}>{isError('cardNumber')}</span>
				</label>
			</div>
			<div className={styles.card_item}>
				<div className={styles.expiry_box}>
					{yymm.map(item => {
						return <label className={classNames(styles.flex1)} key={item.name}>
							<Sselect hideErrorMessage={true} theme={'hasTitle'} id={item.name} option={item.option} value={yymmData[item.name]} verify={item.verify} item={item} placeholder={item.placeholder} onChange={handleSelectChange.bind(this, item.name)} />
						</label>
					})}
				</div>
				<span className={classNames(styles.errortext, styles.errortextExpiry)}>{(isError(yymm[0].name) && yymm[0].message) || (isError(yymm[1].name) && yymm[1].message)}</span>
			</div>
			<div className={styles.card_item}>
				<div className={styles.title}>
					<span>{t('paymentMethod.creditCard.SecurityCode')} *</span>
					{/* <CvvTip t={t} onVisible={(v) => setCvVisible(v)} /> */}
				</div>
				<label className={classNames(styles.cvc, isError('cvc') && styles.error)}>
					<div className={styles.card_img_box}>
						<div className={styles.card_img}>
							<Sicon className={styles.card_icon} icon='cvv' />
						</div>
					</div>
					<input {...getCVCProps({ onChange: (e) => { handleChange('cvc', e.target.value) }, onBlur: (e) => { handleChange('cvc', e.target.value) } })} value={cvc} placeholder={t('paymentMethod.creditCard.CVC')} disabled={cvVisble} />
					<div className={styles.icon_box}>
						<CvvTip t={t} onVisible={(v) => setCvVisible(v)} />
					</div>
					<span className={styles.errortext}>{isError('cvc')}</span>
				</label>
			</div>
			{/* {meta.isTouched && meta.error && <span>{meta.error}</span>} */}
		</div>
	);
}