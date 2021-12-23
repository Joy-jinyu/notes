
import { isEmpty } from '@/utils'

const $rules = function (modulesRule) {
    return function () {
        return {
        // 校验集合
            rules: [],
            /**
             * 校验不能为空
             * @param {String} tips 校验不通过时的提示语
             */
            validateEmpty(tips) {
                this.rules.push((value) => {
                    if (isEmpty(value)) {
                        return tips
                    }
                    return true
                })
                return this
            },
            ...modulesRule,
            /**
             * 添加自定义的校验
             * @param {Function} rule 增加的校验方法
             */
            addCustomize(rule) {
                this.rules.push(rule)
                return this
            },
            /**
             * 校验最终调用点
             * @param {Object} options 配置项
             * @param {String | Array} trigger 校验触发方式
             * @param {String | Array} required 是否是必填项（表单自带的*符号）
             * @param {String} message 必填项的提示语（除了最简单的用法，否则用不到 eg: $rules().end({required: true, message: ''})）
             */
            end(options = { trigger: 'blur', required: false, message: '' }) {
                let validate = {
                    validator: (rule, value, callback) => {
                        for (let rule of this.rules) {
                            const result = rule(value)
                            if (typeof result === 'string') {
                                callback(new Error(result))
                            }
                        }
                        callback()
                    },
                    message: options.message || '',
                    trigger: options.trigger || 'blur',
                    required: options.required || true
                }
                if (this.rules.length === 0) {
                    delete validate.validator
                }
                return validate
            }
        }
    }
}

const RulesServer = {
    install: (Vue) => {
        const modulesRule = loadRules()
        Vue.prototype.$rules = $rules(modulesRule)
    }
}

/**
 * 加载校验规则
 */
const loadRules = function () {
    const modulesRule = {}
    const ruleModules = require.context('./modules', true, /.?(?<!index)\.js$/)
    ruleModules.keys().forEach((fileName) => {
        const module = ruleModules(fileName)
        Object.keys(module).forEach((dataName) => {
            const moduleData = module[dataName]
            Object.keys(moduleData).forEach((rule) => {
                if (modulesRule[rule]) {
                    console.warn(`[Rules] Duplicate named rule definition: ${rule}`)
                }
            })
            Object.assign(modulesRule, moduleData)
        })
    })
    return modulesRule
}

export default RulesServer
