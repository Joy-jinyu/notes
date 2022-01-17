/*
 * @Author: yangj
 * @Date: 2020-02-21 10:55:21
 */
import React, { Component } from "react";
import classNames from 'classnames';
import { Scheckbox, Sinput, Sselect } from '../../index';
import { gtmTrigger, trigger, initBillingAddress, initBillingData, funverify, listenerGoogleKeyError } from "../../../utils"
import { get_all_province, save_billing_address } from "../../../api/api"
import styles from './style.module.scss';

class Index extends Component {
    constructor({ t }) {
        super();
        this.state = {
            is_same_address: true,
            billingAddress: initBillingAddress(t),
            billingData: initBillingData(),
        };
    }
    componentDidMount() {
        let { parentState } = this.props;
        this.currentLng = (document.documentElement.lang || 'en').toLocaleLowerCase();
        let { countryOption = [], formData } = parentState || {};
        let { order = {} } = window.shopify_checkouts || {};
        let { b_address, address } = order || {};
        let data = b_address || formData || {};
        let { country = '', province = '', country_name = '' } = data;
        this.initData();
        this.initCountry({ countryOption, country_code: country, province, country_name });
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        let { billingAddress = [], odlPayment_gate_way } = this.state;
        let { parentState = {} } = nextProps || {};
        let { countryOption, formData } = parentState || {};
        let { payment_gate_way } = formData || {};
        let bCountryOption = ((billingAddress.find(item => item.name === 'billing_country')).option);
        if ((!bCountryOption || bCountryOption.length === 0) && (countryOption?.length)) {
            (billingAddress.find(item => item.name === 'billing_country')).option = countryOption || [];
            this.setState({ billingAddress });
        }
        if (payment_gate_way !== odlPayment_gate_way) {
            this.setState({ odlPayment_gate_way: payment_gate_way });
            this.initData();
        }
    }
    initData = () => {//正向赋值：初始化时候 初始值 取页面的
        let { parentState } = this.props;
        let { billingData, billingAddress } = this.state;
        let { formData } = parentState || {};
        let { order = {} } = window.shopify_checkouts || {};
        let { b_address } = order || {};
        let data = b_address || formData || {};
        billingData.billing_first_name = data.first_name;
        billingData.billing_last_name = data.last_name;
        billingData.billing_address1 = data.address1;
        billingData.billing_address2 = data.address2;
        billingData.billing_city = data.city;
        billingData.billing_postal_code = data.postal_code;
        billingData.billing_country = data.country;
        billingData.billing_country_name = data.country_name;
        billingData.billing_province = data.province;
        billingData.billing_province_name = data.province_name || '';
        billingAddress.forEach(item => {
            item.error && (item.error = false);
        })
        this.setState({ billingData, billingAddress });
    }
    initNewData = (data) => {//反向赋值：保存billing时候更新billing和Windows上的billing
        let { order } = window.shopify_checkouts;
        order.b_address = order.b_address || {};
        let { b_address } = order || {};
        b_address.first_name = data.billing_first_name;
        b_address.last_name = data.billing_last_name;
        b_address.address1 = data.billing_address1;
        b_address.address2 = data.billing_address2;
        b_address.city = data.billing_city;
        b_address.postal_code = data.billing_postal_code;
        b_address.country = data.billing_country;
        b_address.country_name = data.billing_country_name;
        b_address.province = data.billing_province;
        b_address.province_name = data.billing_province_name || '';
        window.shopify_checkouts.order.b_address = b_address;
    }
    initCountry = ({ countryOption, country_code, province, country_name }) => {//为了不重复请求国家接口，我这里是父级调用
        let { billingAddress = [], billingData } = this.state;
        (billingAddress.find(item => item.name === 'billing_country')).option = countryOption || [];
        if (!billingData.billing_country) {//若组件中有数据，就不要影响组件中的数据
            billingData.billing_country = (country_code || (countryOption[0] && countryOption[0].code) || '');
            billingData.billing_country = (country_name || (countryOption[0] && countryOption[0].name) || '');
            billingData.billing_province = province || '';
        }
        this.setState({ billingAddress, billingData });
    }
    getProvinceOption = () => {
        let { billingAddress = [], billingData } = this.state;
        let { billing_country, billing_province, billing_province_name } = billingData || {};
        let provinceArr = {};
        provinceArr = billingAddress.find(item => item.name === 'billing_province');
        provinceArr.isHide = true;
        provinceArr.option = [];
        if (!billing_country) { return };
        get_all_province({ code: billing_country, language: this.currentLng }).then((res = []) => {
            let resLength = res && res.length > 0;
            let effective = {};
            if (resLength) {
                res.forEach(item => {
                    if (item.code === billing_province || item.name === billing_province_name) {
                        effective = item
                    }
                });
            }
            provinceArr.isHide = !resLength;
            provinceArr.option = res || [];
            billingData.billing_province = effective.code || (res && res[0] && res[0].code);
            billingData.billing_province_name = effective.name || (res && res[0] && res[0].name);
            this.initItmeWidth({ resLength, billingAddress });
            this.setState({ billingData, billingAddress });
        })
    }
    initItmeWidth = ({ resLength, billingAddress }) => {
        let arr = ['billing_country', 'billing_province', 'billing_postal_code'];//需要调整的项
        billingAddress.forEach(item => {// eslint-disable-line
            if (item.dynamic) {
                if (arr.includes(item.name) && resLength) {
                    item.dynamic = 30;
                } else {
                    item.dynamic = 50;
                }
            }
        });
    }

    getCreditCardData = async (callback) => {//验证是否合格
        let { billingData, billingAddress = [], is_same_address } = this.state;
        const { t, theme } = this.props;
        let isOk = true;
        let finalData = { is_same_address };//最终参数
        if (!is_same_address) {
            for (let key in billingData) {
                let value = billingData[key];
                billingAddress.forEach(item => {//eslint-disable-line
                    item.isHide ? (item.error = false) : (item.name == key) && funverify({ value, verify: item.verify, item, scroll: true });//eslint-disable-line
                    (item.error === true) && (isOk = false);
                })
            };
            this.setState({ billingAddress });
        }
        if (isOk) {//如果验证都通过了,就输出参数
            finalData = Object.assign(finalData, billingData, { is_same_address: false });
            // if (theme) {
            //     finalData = Object.assign(finalData, billingData, { is_same_address: false });
            // } else {
            //     if (!is_same_address) {//如果是打开的，或者b_address有值的
            //         finalData = Object.assign(finalData, billingData, { is_same_address: false });
            //     }
            // }
            callback && callback(finalData)
            return true;
        } else {
            callback && callback(false);
            return false;
        }
    }
    changeAddress = async (is_same_address, btnType) => {//btnType:Cancel取消的时候执行取消，否则都会保存
        const { t } = this.props;//theme：onepage为默认主题，为空
        trigger(`CheckoutBillingAddress${btnType}`);
        let eventLabel;
        switch (btnType) {
            case 'Edit':
                gtmTrigger({ eventAction: "payment_information",eventLabel: "edit_billing_address" });
                eventLabel = 'edit';
                break;
            case 'Save':
                eventLabel = 'save';
                break;
            case 'Cancel':
                eventLabel = 'cancel';
                break;
            default:
                break;
        }
        if (is_same_address) {//关上时候逻辑
            if (btnType === 'Cancel') {//默认主题(onepage)或者执行的是取消的时候 都恢复
                this.initData();
            } else {
                let isOk = await this.getCreditCardData();
                if (isOk) {
                    this.save_billing_address_fun();
                } else {
                    is_same_address = false
                }
            }
        }
        this.setState({ is_same_address }, () => {
            if (is_same_address === false) {//false表示打开
                // this.completedAutoCompleted('billing_address1');
                //设置首次打开的时候请求省数据
                const { billingAddress } = this.state;
                let provinceArr = billingAddress.find(item => item.name === 'billing_province') || {};
                let { option } = provinceArr;
                if (!option) {
                    this.getProvinceOption();
                }
            }
        });
        this.pushRef();
    }
    save_billing_address_fun = () => {//保存
        let { billingData = {} } = this.state;
        save_billing_address(billingData).then(res => {
            this.initNewData(billingData);
        })
    }
    billingDataChange = (type, val, selectedName) => {
        let { billingData = {} } = this.state;
        billingData[type] = val || '';
        if ((type === 'billing_country') && val != null) {
            billingData.billing_country_name = (selectedName || val);
            this.getProvinceOption(val);
        };
        if ((type === 'billing_province') && val != null) {
            billingData.billing_province_name = (selectedName || val);
        };
        this.pushRef();
        this.setState({ billingData })
    }
    billingFocus = (eventLabel, val) => {
        //按他们上报的文档来
        if (eventLabel === 'billing_country') {
            eventLabel = 'select_country';
        } else if (eventLabel === 'billing_province') {
            eventLabel = 'select_state';
        };
        gtmTrigger({
            eventAction: 'input_billing_address',
            eventLabel
        });
    }
    pushRef = () => {//解决this错误问题
        this.props.billingRef && this.props.billingRef(this);
    }
    // initAddress1 = () => {
    //     let { billingData } = this.state;
    //     const { billing_postal_code = '' } = billingData || {};
    //     let items = ['billing_address2', 'billing_address1', 'billing_city', 'billing_province_name', 'billing_country'];
    //     let shipTo = [];
    //     items.forEach(item => {
    //         billingData[item] && shipTo.push(billingData[item]);
    //     });
    //     return `${billing_postal_code} ${shipTo.toString() || ''}`;
    // }

    initAddress1 = () => {
        let { billingData } = this.state;
        const { parentState } = this.props;
        let { formData } = parentState || {};
        let { order = {} } = window.shopify_checkouts || {};
        let { b_address } = order || {};
        let data = b_address || formData || {};
        let items = ['billing_address2', 'billing_address1', 'billing_city', 'billing_province_name', 'billing_country'];
        let shipTo = [];
        items.forEach(item => {
            billingData[item] && shipTo.push(` ${billingData[item]}`);
        });
        return (billingData && billingData.billing_address1) ? `${billingData.billing_postal_code} ${shipTo.toString() || ''}` : '';
    }
    newTitle = () => {
        const { t, parentState } = this.props;
        let { formData } = parentState || {};
        let { payment_method } = formData || {};
        const { is_same_address } = this.state;
        return <div className={styles.billingTitle}>
            <div className={styles.billingTitleTop}>
                <div className={styles.title_}>{t('paymentMethod.billingAddress.title')}</div>
                <div className={classNames(styles.option)}>{!is_same_address && <span style={{ margin: '0 20px', color: '#666' }} onClick={() => { this.changeAddress(!is_same_address, 'Cancel') }}>{t('Cancel')}</span>}<span onClick={() => { this.changeAddress(!is_same_address, is_same_address ? 'Edit' : 'Save') }}>{is_same_address ? t('Edit') : t('Save')}</span></div>
            </div>
            {/* {is_same_address && this.initAddress1() && <div className={styles.itemText}>{this.initAddress1()}</div>} */}
        </div>
    }
    render(props, state) {
        const { t, theme } = this.props;
        const { billingAddress, billingData, is_same_address } = this.state;
        const { shop } = window.shopify_checkouts;
        const isJPShop = shop && shop.name && shop.name.toLocaleLowerCase() === 'vivaiacollection_jp'

        return <div>
            {!isJPShop && this.newTitle()}
            {!is_same_address && <div className={classNames(styles.inputParent, is_same_address && styles.closebillingAddress)}>
                {billingAddress.map((item, index) => {
                    if (item.type === 'title') {
                        return <div key={index} className={styles.title}>{item.name}</div>
                    } else if (item.type === 'select' && !item.isHide) {
                        return <Sselect theme={theme} id={item.name} className={classNames(item.dynamic === 50 && styles.width50, item.dynamic === 30 && styles.width30)} option={item.option} value={billingData[item.name]} verify={item.verify} item={item} key={index} placeholder={item.placeholder} onChange={this.billingDataChange.bind(this, item.name)} onFocus={this.billingFocus.bind(this, item.name)} />
                    } else if (item.type === 'input') {
                        return <Sinput theme={theme} id={item.name} className={classNames(item.dynamic === 50 && styles.width50, item.dynamic === 30 && styles.width30)} value={billingData[item.name]} verify={item.verify} item={item} key={index} placeholder={item.placeholder} onChange={this.billingDataChange.bind(this, item.name)} onFocus={this.billingFocus.bind(this, item.name)} />
                    } else {
                        return null
                    }
                })}
            </div>}
            {/* <div className={styles.tipText}>{t('paymentMethod.billingAddress.tip')}</div> */}
        </div>
    }
}

export default Index;