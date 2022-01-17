import webBridge from '@/jsBridge/bridge';

/**
 * 调用原生支付
 * @param {object} options 
 * @param {function} callback // 操作之后的回调结果
 */
export const payNowApplePayAction = (options, callback) => {
    webBridge.emit('payNowApplePayAction', options, callback)
}

/**
 * 调用apply pay后，注册的回调供native触发传数据回来
 * @param {object} options 
 * @param {function} callback 
 */
export const applePayCallbackAction = (callback) => {
    webBridge.on('applePayCallbackAction', callback)
}
/**
 * 调用原生事件上报
 * @param {object} options 
 * @param {function} callback // 操作之后的回调结果
 */
export const eventPayment = (options, callback) => {
    console.log('app eventPayment options',options)
    webBridge.emit('eventPayment', options, callback)
}
const bridgeApi = {
    payNowApplePayAction,
    applePayCallbackAction,
    eventPayment
}
export default bridgeApi