
//unshift
const currentLng = (document.documentElement.lang || 'en').toLocaleLowerCase();
const IS_JP = currentLng==='ja';
export const ShippingFormatedAddress = (shippingData, shopInfo, type = '') => {//type:'vivaia_ui时候没有address1
    const { postal_code = '' } = shippingData || {};
    const { name = '' } = shopInfo || {};
    const JpPostCodeFormater = (code) => {
        if (code && code.length > 3) {
            const codeStr = code.replace(/(\d\d\d)\s*([\d]+)/, "$1-$2")
            return `〒${codeStr}`
        } else {
            return code
        }
    }
    let shipTo = [], items = [];
    switch (type) {
        case 'vivaia_ui':
            shipTo = [];
            items = ['address2','address1', 'city', 'province_name', 'country_name'];
            items.forEach(key => {
                if (key === 'country_name') {
                    if(IS_JP){
                        shipTo.unshift(` ${shippingData[key] || shippingData['country']}`);
                    }else{
                        shipTo.push(` ${shippingData[key] || shippingData['country']}`);
                    }
                } else if (shippingData[key]) {
                    if(IS_JP){
                        shipTo.unshift(` ${shippingData[key]}`);
                    }else{
                        shipTo.push(` ${shippingData[key]}`);
                    }
                }
            });
            if (IS_JP) {
                return `${JpPostCodeFormater(postal_code)} ${shipTo.toString() || ''}`;
            } else {
                return `${shipTo.toString() || ''} ${postal_code}`;
            }
        default:
            shipTo = [];
            items = ['address2', 'address1', 'city', 'province_name', 'country'];
            items.forEach(key => {
                if (shippingData[key]) {
                    if(IS_JP){
                        if((key==='country')&&(shippingData[key].toLocaleLowerCase() === 'jp')){
                            shipTo.unshift(` 日本`);
                        }else{
                            shipTo.unshift(` ${shippingData[key]}`);
                        }
                    }else{
                        shipTo.push(` ${shippingData[key]}`);
                    }
                }
            });
            if (IS_JP) {
                return `${JpPostCodeFormater(postal_code)} ${shipTo.toString() || ''}`;
            } else {
                return `${shipTo.toString() || ''} ${postal_code}`;
            }
    }

}
