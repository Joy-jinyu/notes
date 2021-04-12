module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ['plugin:vue/essential', 'standard'],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: [],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        indent: ['error', 4],
        'space-before-function-paren': ['error', 'always']
    }
}
