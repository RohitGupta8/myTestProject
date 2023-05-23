import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'

export default {
    input: 'index.js',
    output: {
        dir: 'dist',
        preserveModules: true,
        format: 'es'
    },
    plugins: [
        json(),
        commonjs()
    ]
}
