
import { label, format, arrayToObject, isEmpty } from 'utils/dictionary'

class Dictionary {
    // 字典项数据
    _data
    // 已经加载过的路径
    _registryPath

    constructor(dictionaryData) {
        this.loadData(dictionaryData)
        this.constructor.prototype.format = format
    }

    /**
     * 加载新的字典数据
     * @param {Object} dictionaryData 要加载进来的字典数据
     */
    loadData(dictionaryData) {
        if (dictionaryData) {
            const data = this._data || {}
            Object.keys(dictionaryData).forEach((dictionary) => {
                if (data[dictionary]) {
                    console.warn(`[dictionary registry] Duplicate named dictionary definition: ${dictionary}`)
                }
            })
        }
        this._data = Object.assign({}, this._data, dictionaryData)
    }

    /**
     * 注册已经加载过的字典路径
     * @param {string} path 字典路径
     */
    registry(path = []) {
        this._registryPath = (this._registryPath || []).concat(path)
    }

    /**
     * 校验路径是否已经加载过
     * @param {string} path 字典路径
     * @returns 当前路径是否已经加载过
     */
    pathIsExist(path) {
        return (this._registryPath || []).includes(path)
    }

    /**
     * 通过字典名获取选项
     */
    get(code, config = {}) {
    // 获取到用户目标的源数组
        let options = this._data[code]
        const { appoint = [], appointKey = 'value', isObject = false, objectKey = 'value', objectValue = 'label' } = config

        // 有指定数据的话，只返回指定数据
        if (appoint.length > 0) {
            options = options.filter((option) => appoint.includes(option[appointKey]))
        }
        // 如果是Object类型数据的话, 则将数据转成Object返回
        if (isObject) {
            return arrayToObject(options, objectKey, objectValue)
        }
        return options
    }

    /**
    *
    * @param {String} code 字典名
    * @param {String|Number} value 字典项的value
    */
    label(code, value, valueKey = 'code', valueLabel = 'label') {
    // 获取到用户目标的源数组
        let options = this._data[code]
        return label(options, {
            valueKey,
            value,
            label: valueLabel
        })
    }
}


class SingleDictionary {
    // 字典项实例
    static _dictionary

    static getInstance(dictionaryData) {
        if (!this._dictionary) {
            this._dictionary = new Dictionary(dictionaryData)
        } else if (!isEmpty(dictionaryData)) { // 如果数据项不为空，则加载数据
            this._dictionary.loadData(dictionaryData)
        }
        return this._dictionary
    }
}

export default SingleDictionary
