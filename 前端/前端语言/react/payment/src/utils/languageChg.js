

export const getChgLanguageParams = (langCode, prefix) => {
  const currentShop = window.shopify_checkouts && window.shopify_checkouts.shop 
  const platForm = currentShop && currentShop.platform_name
  if(platForm) {
    switch(platForm.toLocaleUpperCase()) {
      case "MIDDLEEAST":
        return ""
      default:
        return `${prefix}language=${langCode}`
    }
  } else {
    return ""
  }

}