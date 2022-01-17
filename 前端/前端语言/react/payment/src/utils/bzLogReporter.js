const parser = require('ua-parser-js');

//业务埋点日志上报
class BzLogReporter {
  constructor() {
    this.reporterUUID_KEY = "__sl_reporter_uuid_key__"
  }
  init() {
    try {
      const cacheUUID = this.getUUID()
      if(!cacheUUID) {
        const u = new URL(window.location.href)
        const uuid = u && u.searchParams.get("uuid")
        if(uuid) {
          window.sessionStorage.setItem(this.reporterUUID_KEY, uuid)
        }
      }

    } catch (error) {
      console.log(error)
    }
  }

  getUUID() {
    return window.sessionStorage.getItem(this.reporterUUID_KEY)
  }

  getBrandId() {
    return window.shopify_checkouts && window.shopify_checkouts.shop.name
  }
  getBrandPltaform() {
    let platform = ""
    if(window.shopify_checkouts && window.shopify_checkouts.order) {
      const order = window.shopify_checkouts.order
      if(order.client && order.client === 1) {
        platform = "ios"
      }
      if(order.client && order.client === 2) {
        platform = "android"
      }
    }
    if(platform !== "") {
      return platform
    } else {
      if (navigator.userAgent) {
        let ua = parser(navigator.userAgent)
        let osname = ua.os && ua.os.name
        osname = osname && osname.toLocaleLowerCase()
        if(osname === "ios" || osname === "android") {
          platform = "wap"
        } else {
          platform = "web"
        }
      }
      return platform
    }

  }

  //发送用户点击 pay now 按钮事件
  sendPayNowEvent() {
    try {
      const REPORT_DOMAIN = process.env.REPORT_DOMAIN;
      const uuid = this.getUUID()
      const brandId = this.getBrandId()
      const platform = this.getBrandPltaform()
      const event_name = "PayOrder"
      if(uuid) {
        const version = '1.0.20210800'
        const url = `https://${REPORT_DOMAIN}/brand_id=${brandId}&brand_platform=${platform}&uuid=${uuid}&version=${version}&event=${event_name}`
        const xmlHttp = new XMLHttpRequest()
        xmlHttp.open("GET", url, true)
        xmlHttp.send(null)
      }

    } catch (error) {
      console.log(error)
    }
  }
}

export default BzLogReporter