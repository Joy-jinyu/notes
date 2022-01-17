
const DOMAIN = process.env.DOMAIN || '';
const baseURL = `https://${DOMAIN}/`

function initUrl(url) {
  return (url.includes('https://') || url.includes('http://')) ? url : `${baseURL}${url}`
}
const { shop = {} } = window.shopify_checkouts || {};
const { identity_code = '', csrf_token = '', platform_name } = shop;


export function post(url, data) {
  return fetch(initUrl(url), {
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      identity_code,
      csrf_token,
      platform_name
    },
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin',
    mode: 'cors',
    method: "POST",
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // *client, no-referrer
  }).then((response) => response.json());
}

export function get(url, params) {
  let nextUrl =init(url);

  if (params) {
    const paramsArray = [];
    //拼接参数
    Object.keys(params).forEach((key) =>
      paramsArray.push(key + "=" + params[key])
    );
    if (nextUrl.search(/\?/) === -1) {
      nextUrl += "?" + paramsArray.join("&");
    } else {
      nextUrl += "&" + paramsArray.join("&");
    }
  }
  //fetch请求
  return fetch(nextUrl, {
    method: "GET",
    mode: 'cors'
  }).then((response) => response.json());
}
