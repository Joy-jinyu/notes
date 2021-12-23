import axios from 'axios'
import qs from 'qs'

class Axios {
    constructor() {
        this._axios = this._loadConfig()
    }

    getInstance() {
        if (!this._axios) {
            this._axios = this._loadConfig()
        }
        return this._axios
    }

    _loadConfig() {
        const timeout = 5 * 60 * 1000 // 请求超时时间5分钟
        const baseURL = process.env.BASE_API // api的base_url
        const axiosInstance = axios.create(
            {
                baseURL,
                timeout
            }
        )
        axiosInstance.interceptors.request.use(this._requestFulfilled, this._requestRejected)
        axiosInstance.interceptors.response.use(this._responseFulfilled, this._responseRejected)
        return axiosInstance
    }

    _requestFulfilled(config) {
        // noPromptError = false
        // Do something before request is sent
        if (['get', 'delete'].includes(config.method)) {
            config.paramsSerializer = function (params) {
                return qs.stringify(params, { arrayFormat: 'repeat' })
            }
        }
        return config
    }

    _requestRejected(error) {
        // Do something with request error
        console.error(error) // for debug
        Promise.reject(error)
    }

    _responseFulfilled(response) {
        return response.data
    }

    _responseRejected(error) {
        const { response } = error

        return Promise.reject(response)
    }
}

const AxiosServer = {
    install: (Vue) => {
        const axiosServer = new Axios()
        Vue.prototype.$axios = axiosServer.getInstance()
    }
}

export default AxiosServer
