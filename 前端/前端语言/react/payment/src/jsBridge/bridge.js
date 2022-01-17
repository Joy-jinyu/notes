/**
 * 桥接bridge： 成功后可通过callback里的实参bridge进行交互
 * @param {function} callback 桥接成功后的回调使用
 * @returns 
 */
 export const connectWebViewJavascriptBridge = function (callback) {
    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

/**
 * bridge对象的方法使用封装类
 */
const WebviewBridge = function () {}

/**
 * 
 * @param {string} eventName 
 * @param {object} params 
 * @param {function} callback 
 */
WebviewBridge.prototype.emit = function(eventName = '', params = {}, callback) {
    connectWebViewJavascriptBridge(function (bridge) {
        // 触发APP事件，并传递数据
        bridge.callHandler(
            eventName,
            //安卓系统必须传一个参数，否则捕获不到，因此，默认传入一个adr变量
            // JSON.stringify({
            //     ...params,
            //     adr: 1,
            // }),
            {...params},
            callback
        );

    })
}

/**
 * 事件注册监听
 * @param {string}} eventName  事件名称
 * @param {function} callback 事件注册成功后的回调
 */
WebviewBridge.prototype.on = function(eventName, callback) {
    connectWebViewJavascriptBridge(function(bridge) {
        bridge.registerHandler(eventName, callback)
    })
}
const webBridge = new WebviewBridge()
export default webBridge