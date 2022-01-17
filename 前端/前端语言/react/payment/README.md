## html中服务端渲染的变量介绍
    对应后端的webserver的渲染
#### ShopShortDomain
    `//文档title`
    基于 `shopify_checkouts.shop.domain` 然后后端加工了一下(把‘/’去掉了)
#### PageFontFamilyUrl
    `//字体地址`
    基于`shopify_checkouts.shop.page_font_family_url`
#### IsFromApp
    `//是否是app`
    基于url里边的is_app=1
#### HasApplePay
    `//支付方式中是否有Apple Pay`
    基于`shopify_checkouts.order.groupGateway`数组中包含apple_pay，且该项对应的publicKey有值
#### FacebookPixelId
    `//是否需要Facebook Pixel`
    如果该网站配置了Facebook Pixel id 就渲染这个sdk
#### GoogleAccountId
    `//google的一个代码管理系统`
