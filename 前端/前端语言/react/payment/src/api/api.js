/*
 * @Author: yangj
 * @Date: 2019-12-16 09:28:17
 * @LastEditors: yangj
 */
// import { post, get, put } from '../utils/request';
import { post, get } from '../http'

import { Debounce, getPageInfo, IS_APP, get3ds } from '../utils';


const { order, shop } = window.shopify_checkouts;
const { order_status_url: success_url, uuid, address, language } = order || {};
const { country } = address || {};
const { identity_code } = shop || {};
export function checkout_deal(data) {//多个UI在调用这个接口，所以get3ds就统一在这里加了
    return post('onepage/shopify/checkout_deal', { black_box: sessionStorage.getItem('black_box') || '', is_app: IS_APP ? '1' : undefined, success_url, identity_code, ...data, ...get3ds() });
}

export function get_all_country(data) {//获取国家
    return get(`shopify/checkout/get_all_country`, data, { isalert: true });
}
export function get_all_province(data) {//根据国家获取省
    return get(`shopify/checkout/get_all_province`, data, { isalert: true });
}
export function get_shipping_zones(data) {//直接获取邮费列表
    return get(`shopify/get_shipping_zones`, data, { isalert: true });
}
export function harbor_shipping_method(data) {//获取国家对应的邮费计算表
    return get(`harbor/harbor_shipping_method`, data, { isalert: true });
}
export function get_gateway_country(data) {//获取每一种支付方式对应的国家表
    return get(`shopify/get_gateway_country_v2`, data, { isalert: true });
}
export function get_group_gateway_country(data) {//获取每一种支付方式对应的国家表0617
      return get(`shopify/get_group_gateway_country`, data);
    // return new Promise((resolve, reject) => {
    //     resolve([
    //         { payMethod: "PayPal", payGateWay: "fast_pay_pal", publicKey: "",payPrice:0,currency:'EUR' },
    //         { payMethod: "AfterPay", payGateWay: "afterpay_au", publicKey: "" ,payPrice: 20.38,currency:'AUD',publicKey: "42621"},
    //         // {
    //         //     payMethod: "Checkout", payGateWay: "credit", publicKey: "pk_test_61801af3-d323-44f9-a42a-82669df3bdcb",
    //         //     discount: {
    //         //         "discountType": 2,//优惠类型1-满减，2-折扣
    //         //         "discountAmount": 4.5,//优惠金额,币种与订单币种保持一致
    //         //         "ruleCheck": 100,//满xx
    //         //         "ruleParam": 4.5,//折扣xx或减xx
    //         //     }
    //             //   bindCards:[
    //             //     {
    //             //       "cardNumber": "411111******1111",
    //             //       "clientIdentity": "c500pqbqd2mm3m2o4ti0",
    //             //       brand:'VISA',
    //             //     },
    //             //     {
    //             //       "cardNumber": "557606******0000",
    //             //       "clientIdentity": "c5014u3qd2ms706jh5c0",
    //             //       brand:'MADA',
    //             //     },
    //             //     {
    //             //       "cardNumber": "471110******0000",
    //             //       "clientIdentity": "c5014u3qd2ms706jh5c01",
    //             //       brand:'DISCOVER',
    //             //     },
    //             //     {
    //             //       "cardNumber": "471110******0000",
    //             //       "clientIdentity": "c5014u3qd2ms706jh5c02",
    //             //       brand:'MASTER',
    //             //     },
    //             //     {
    //             //       "cardNumber": "588845******0000",
    //             //       "clientIdentity": "c5014u3qd2ms706jh5c03",
    //             //       brand:'JCB',
    //             //     },
    //             //     {
    //             //       "cardNumber": "471110******0000",
    //             //       "clientIdentity": "c5014u3qd2ms706jh5c04",
    //             //       brand:'AMEX',
    //             //     },
    //             //     {
    //             //       "cardNumber": "471110******0000",
    //             //       "clientIdentity": "c5014u3qd2ms706jh5c04",
    //             //       brand:'amexaa',
    //             //     }
    //             //   ]
    //         // },
    //         // { payMethod: "Checkout", payGateWay: "mada_credit", publicKey: "pk_test_61801af3-d323-44f9-a42a-82669df3bdcb" },
    //         { payMethod: "Stripe", payGateWay: "apple_pay", publicKey: "pk_test_51IjIiJKcw10Zf2AN0OvT8OsngP9wzK5y71ECTmsE9leLGOklV90xuIWphoolPBwPkuehuMelV9zM1BJxpOZ4BLN100tQFszW0A" },
    //         { payMethod: "Checkout", payGateWay: "apple_pay", publicKey: "pk_test_51IjIiJKcw10Zf2AN0OvT8OsngP9wzK5y71ECTmsE9leLGOklV90xuIWphoolPBwPkuehuMelV9zM1BJxpOZ4BLN100tQFszW0A" },
    //         // { payMethod: "Ebanx", payGateWay: "pse", publicKey: "" },
    //         { payMethod: "Klarna", payGateWay: "klarna_us", publicKey: "",payPrice:1,currency:'USD' },
    //         // { payMethod: "PayPal", payGateWay: "fast_pay_pal", publicKey: "" },//fast_pay_pal/normal_pay_pal
    //         { payMethod: "PayPal", payGateWay: "pay_pal_credit", publicKey: "",currency:'USD',"discount":{
    //             "discountType":1,
    //             "discountAmount":10.2,
    //             "ruleCheck":100,
    //             "ruleParam":10.2,
    //         } },
    //         {
    //           "payMethod": "Ebanx",
    //           "payGateWay": "credit",
    //           "publicKey": "",
    //           payPrice:12.3,
    //           "instalments": [
    //             {
    //               "periodNumber": 1,
    //               "customerInterestRate": 0,
    //               "periodAmount": 590,
    //               "totalAmount": 20,
    //               "interest": 1.2,
    //               "currency": "BRL"
    //             },
    //             {
    //               "periodNumber": 3,
    //               "customerInterestRate": 1.15,
    //               "periodAmount": 198.5,
    //               "totalAmount": 595.5,
    //               "interest": 1.5,
    //               "currency": "BRL"
    //             },
    //             {
    //               "periodNumber": 12,
    //               "customerInterestRate": 1.15,
    //               "periodAmount": 199.5,
    //               "totalAmount": 597.5,
    //               "interest": 2.5,
    //               "currency": "BRL"
    //             }
    //           ],
    //           discount: {
    //             "discountType": 2,//优惠类型1-满减，2-折扣
    //             "discountAmount": 4.5,//优惠金额,币种与订单币种保持一致
    //             "ruleCheck": 100,//满xx
    //             "ruleParam": 4.5,//折扣xx或减xx
    //         }
    //         }
    //     ])
    // })
    // return get(`http://10.250.10.242:7002/shopify/get_group_gateway_country`, data);
}
export function get_shipping_country_code(data) {//获取订单的国家，用于计算邮费
    return get(`shopify/get_shipping_country_code`, data, { isalert: true });
}

export function get_paypal_shipping_info(data) {//获取当前用户的信用卡地址
    return get(`shopify/get_paypal_shipping_info`, data, { isalert: true });
}
export function update_draft_order(data) {
    return Debounce('update_draft_order', () => {
        return post('shopify/update_draft_order', { identity_code, ...data });
    })
}
export function apply_discount_code(data) {//查询优惠券
    return post('shopify/apply_discount_code', data, { isalert: true });
}
export function harbor_preview(data) {//harber查询优惠券
    return get('harbor/harbor_preview', data, { isalert: true });
}
export function remove_discount_code(data) {
    return post(`onepage/shopify/remove_discount_code`, data, { isalert: true });
}
// export function update_ui_version(data) {//提交ui版本
//   return post('shopify/update_ui_version',data,false);
// }
export function ocean_payment_get(data) {//查询钱海支付状态
    return get('payment/ocean_payment_get', data, { isalert: true });
}

export function refresh_inventory(data) {//查询0库存的商品
    return get('shopify/refresh_inventory', data);
}

export function page_loaded(data) {   //前端信息上报
    const pageInfo = getPageInfo();

    return post(
        `onepage/report/page_loaded/${pageInfo.trans_id}`,
        { ...pageInfo, ...data },
        { headers: { 'Content-Type': 'application/json' }, isalert: false }
    );
}
// export function page_loaded(data) {
//   return post(`onepage/report/page_loaded/${data.uuid}`, data, { isalert: false });
// }
export function get_bank_list(data) {//获取银行列表
    return get(`shopify/get_bank_list`, { uuid, ...data }, { isalert: true });
}
export function save_billing_address(data) {
    return post(`payment/save_billing_address`, { uuid, ...data });
}


export function get_client_token(data) {//获取klarna client_token
    return get(`payment/get_client_token`, { uuid, identity_code, language, ...data });
}
export function get_click_back(data) {//给后端反馈用户重新返回了收银台
    return post(`payment/click_back`, { uuid, ...data });
}
export function reportSurvey(data) {//反馈需要的支付方式给后端
    return post(`onepage/report/survey`, { paymentUuid: uuid, identityCode: identity_code, ...data });
}
export function validate_session(data) {//applepay 权限验证
    return post(`payment/validate_session`, { uuid, identityCode: identity_code, ...data });
}