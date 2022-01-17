import { post } from "../http";
import parser from "ua-parser-js";

// 收集收银台错误日志信息
export const reportError = async (message, error = '') => {
  if (window.shopify_checkouts) {
    const { order, shop } = window.shopify_checkouts;
    const pageInfo = {};

    if (navigator.userAgent) {
      let ua = parser(navigator.userAgent);
      pageInfo.bname = ua.browser && ua.browser.name;
      pageInfo.bver = ua.browser && ua.browser.version;
      pageInfo.osname = ua.os && ua.os.name;
      pageInfo.osver = (ua.os && ua.os.version) || "";
      pageInfo.devendor = (ua.device && ua.device.vendor) || "";
      pageInfo.demodel = (ua.device && ua.device.model) || "";
      pageInfo.detype = (ua.device && ua.device.type) || "";
  }

    const data = {
      domain: shop.domain,
      platform: shop.platform_name,
      platform_order_id: order.orderId,
      platform_order_name: order.orderNumber,
      url: location.href,
      error_category: message,
      // 错误类别名
      error_message:
        typeof error === "object"
          ? error.message ? error.message:`${error.stack}`.replace(/[\r\n]/g, "")
          : error,
      uuid: order.uuid,
      lang: navigator.language,
      ...pageInfo,
    };

    return post("onepage/report/front_error", data, {headers: {'Content-Type': 'application/json'}});
  }
};
