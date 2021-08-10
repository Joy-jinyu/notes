export function isEmpty(value) {
    if (typeof value === 'string') {
        return value.trim() === ''
    }

    if (value === undefined || value === null) {
        return true
    }

    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            return value.length === 0
        } else {
            return JSON.stringify(value) === '{}'
        }
    }

    return false
}

/**
 *
 * @param {Array} options 字典的选择项
 * @param {String} valueKey 字典值得 key 名称
 * @param {String} value 字典项的value
 * @param {String|Number} label 字典项的显示名称
 */
 export const label = function (options = [], config = {}) {
    const { valueKey = 'code', value = '', label = 'label' } = config
    const object = options.find((option) => option[valueKey] === value)
    return object ? object[label] : ''
}

/**
 *
 * @param {Array} array 数据源
 * @param {String} config.code
 * @param {String} config.value
 * @param {String} config.label
 * @param {Boolean} config.isObject 是否返回Object类型的数据
 * @param {'value' | 'code'} config.objectKey 返回时Object类型时, 对象的key是哪个字段
 * @param {'label'} config.objectValue 返回时Object类型时, 对象的value是哪个字段
 */
export const format = function (array = [], config = {}) {
    const { code = 'value', value = 'enumValue', label = 'name', isObject = false, objectKey = 'value', objectValue = 'label' } = config
    const options = array.map((option) => {
        return {
            code: option[code],
            value: option[value],
            label: option[label]
        }
    })
    // 如果是Object类型数据的话, 则将数据转成Object返回
    if (isObject) {
        return arrayToObject(options, objectKey, objectValue)
    }
    return options
}

/**
 * 将数组转换成对象输出
 * @param {Array} array 数据源
 * @param {String} objectKey [required] 对象key取值的属性
 * @param {String} objectValue [required] 对象value取值的属性
 */
export const arrayToObject = function (array = [], objectKey, objectValue) {
    let objectOption = {}
    array.forEach(option => {
        objectOption[option[objectKey]] = option[objectValue]
    })
    return objectOption
}
