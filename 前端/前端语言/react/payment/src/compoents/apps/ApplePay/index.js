import { validate_session } from "../../../api/api"
const HasApplePay = () => {
    const { host } = window.location || {};
    return window.ApplePaySession && ApplePaySession.canMakePaymentsWithActiveCard(host) && ApplePaySession.canMakePayments()
}
const load = (data, callback) => {
    if (HasApplePay) {
        const { formData, onGateWayItem } = data;
        const { currency, payPrice = '', merchant = '' } = onGateWayItem || {};
        const { country } = formData || {};
        const applePaySession = new ApplePaySession(6, {
            countryCode: (country || '').toUpperCase(),
            currencyCode: (currency || '').toUpperCase(),
            supportedNetworks: ["visa", "masterCard", "amex", "discover", 'mada', 'jcb', 'maestro'],
            // supportedNetworks: ["visa", "masterCard", "amex", "discover", 'mada','jcb','maestro','cartesBancaires','chinaUnionPay','eftpos','electron','elo','girocard','interac','mir','privateLabel','vPay'],
            merchantCapabilities: ["supports3DS"],
            total: { label: merchant, amount: payPrice }
        });
        applePaySession.begin();
        //苹果的第一次验证
        applePaySession.onvalidatemerchant = (event) => {
            const appleurl = event.validationURL;
            validate_session({ appleurl }).then(res => {
                console.log('validate_session', JSON.parse(res || ''));
                applePaySession.completeMerchantValidation(JSON.parse(res || ''));
            });
        };
        //苹果的授权付款 touchID或者face ID后触发结果
        applePaySession.onpaymentauthorized = (event) => {
            const response = (type) => {
                if (type === 'success') {
                    applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS)
                } else {
                    applePaySession.completePayment(ApplePaySession.STATUS_FAILURE)
                }
            }
            const token = event.payment.token;
            if (token) {
                callback(JSON.stringify(token), response);
            } else {
                applePaySession.completePayment(ApplePaySession.STATUS_FAILURE)
            }
            // pay(token, function (outcome) {
            //     if (outcome) {
            //         applePaySession.completePayment(ApplePaySession.STATUS_SUCCESS);
            //     } else {
            //         applePaySession.completePayment(ApplePaySession.STATUS_FAILURE);
            //     }
            // })
        };
    };
};
export default { load, HasApplePay }