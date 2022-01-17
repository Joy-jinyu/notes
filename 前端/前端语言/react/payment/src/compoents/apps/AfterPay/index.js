
import {  loadscript } from '../../../utils';
import { AFTERPAY_SDK } from "../../../utils/dadas"
let status ='';
const load=(data)=>{
    const {isPreload = false,cards=[] }=data||{};
    const { publicKey = '',payPrice,currency } = (cards.length > 0 && cards.find(item => item.payMethod === 'AfterPay')) || {};
    if(publicKey){
        if (window.AfterPay) {
            if(!isPreload){//选中afterpay
                initWidgets({payPrice,currency,...data});
            }
        } else {
            if(isPreload){
                loadscript({ url: `${AFTERPAY_SDK}?merchant_key=${publicKey}`, id: 'AfterPay_sdk', obj: 'AfterPay', isPreload });
            }else{
                loadscript({ url: `${AFTERPAY_SDK}?merchant_key=${publicKey}`, id: 'AfterPay_sdk', obj: 'AfterPay', isPreload }, () => {
                    initWidgets({payPrice,currency,...data});
                });
            }
        }
    }
};
const initWidgets=(data)=>{
    const ids=document.getElementById('afterpay-widget-container');
    if(!ids||status==='onReady'){return};
    if(status!=='onReady'){//不是成功状态 就清除
        ids.innerHTML='';
    };
    const {payPrice='',currency="AUD",formData={}}=data||{};
    const newPayPrice=payPrice?payPrice.toString():'';
    const { country = '' } = formData || {};
    const { order = {} } = window.shopify_checkouts || {};
    const { language = '' } = order;
    const locale = `${language}-${country}` || 'en-AU';
    window.afterpayWidget = new AfterPay.Widgets.PaymentSchedule({
        // token: 'client_secret',
        target: '#afterpay-widget-container',
        locale,
        amount: { amount:newPayPrice, currency },
        onReady: function (event) {
            status='onReady';
            console.log('onReady', event);
            // Fires when the widget is ready to accept updates.  
        },
        onChange: function (event) {
            status='onChange';
            console.log('onChange', event);
            // Fires after each update and on any other state changes.
            // See "Getting the widget's state" for more details.
        },
        onError: function (event) {
            status='onError';
            console.log('onError', event);
            // See "Handling widget errors" for more details.
        },
    });
}
export default {load}