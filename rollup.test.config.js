import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import {babel} from '@rollup/plugin-babel'

export default {
    input: 'test/index.js',
    output: {
        file: 'dist/bundle.test.js',
        format: 'cjs'
    },
    plugins: [
        json(),
        resolve(),
        commonjs(),
        babel({babelHelpers: 'bundled'})
    ]
}
