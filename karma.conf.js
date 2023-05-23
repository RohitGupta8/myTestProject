/* eslint-env node */

module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: ['browserify', 'tap'],
        reporters: ['dots'],
        files: [
            'dist/bundle.test.js'
        ],
        preprocessors: {
            'dist/bundle.test.js': ['browserify']
        },
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        autoWatch: false,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,
        browserify: {
            debug: true,
            transform: []
        }
    })
}
