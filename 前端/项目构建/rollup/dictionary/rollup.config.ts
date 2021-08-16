import { defineConfig } from 'rollup';

export default defineConfig({
    input: 'index.js',
    output: [{
        format: 'amd',
        file: './dist/dist.amd.js'
    }, {
        format: 'cjs',
        file: './dist/dist.cjs.js'
    }, {
        format: 'es',
        file: './dist/dist.es.js'
    }, {                                                                                          
        format: 'iife',
        name: 'dictionary',
        file: './dist/dist.iife.js'
    }, {
        format: 'umd',
        name: 'dictionary',
        file: './dist/dist.umd.js'
    }]
})