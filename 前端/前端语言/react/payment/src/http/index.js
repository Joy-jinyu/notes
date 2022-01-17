import axiosHttp from './http'
/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */
 export function get (url, params = {}, config = {}) {
    return new Promise((resolve, reject) => {
        axiosHttp.get(url, {
            params: params
        }, config)
        .then(response => {
            resolve(response)
        })
        .catch(err => {
            reject(err)
        })
    })
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
 export function post (url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
        axiosHttp.post(url, data, config)
        .then(response => {
            resolve(response)
        }, err => {
            reject(err)
        })
    })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
 export function patch (url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
        axiosHttp.patch(url, data, config)
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
 export function put (url, data = {}, config = {}) {
    return new Promise((resolve, reject) => {
        axiosHttp.put(url, data, config)
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
    })
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
 export function del (url, config = {}) {
    return new Promise((resolve, reject) => {
        axiosHttp.delete(url, config)
            .then(response => {
                resolve(response.data)
            }, err => {
                reject(err)
            })
    })
}

export default {
    get,
    post,
    patch,
    put,
    del
    
}