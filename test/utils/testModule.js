import tape from 'tape'
import DefaultDOMElement from '../../dom/DefaultDOMElement'
import inBrowser from '../../util/inBrowser'

function _setupSandbox(t) {
    if (t.sandbox) {
        t.sandbox.empty()
    } else {
        // HACK: this is karma/qunit specific
        if (inBrowser) {
            let fixtureElement = window.document.querySelector('#qunit-fixture')
            if (!fixtureElement) {
                fixtureElement = window.document.createElement('div')
                fixtureElement.id = "qunit-fixture"
                window.document.querySelector('body').appendChild(fixtureElement)
            }
            let sandboxEl = window.document.createElement('div')
            fixtureElement.appendChild(sandboxEl)
            t.sandbox = DefaultDOMElement.wrapNativeElement(sandboxEl)
            t.sandbox._shouldBeRemoved = true
        } else {
            let doc = DefaultDOMElement.createDocument('html')
            let sandbox = doc.createElement('div')
            doc.appendChild(sandbox)
            t.sandbox = sandbox
        }
    }
}

function _teardownSandbox(t) {
    const sandbox = t.sandbox
    // TODO: why is this so important?
    if (sandbox && sandbox._shouldBeRemoved) {
        sandbox.remove()
    }
}

/**
 * @callback TestRunner
 * @param {string} name
 * @param {tape.TestCase} thing
 */

/**
 *
 * @param {*} name
 * @param {*} options
 *
 * @return {TestRunner}
 */
export const module = (name, options = {}) => {

    const before = options.before
    const after = options.after

    /**
     *
     * @param {*} name
     * @param  {tape.Test|object} args
     */
    function registerTest(name, ...args) {

        const [cbOrOpts, optsOrCb = {}] = args

        const cb = typeof cbOrOpts === 'function' ? cbOrOpts : optsOrCb
        const opts = optsOrCb

        let t = tape(name, Object.assign({}, options, opts), (t) => {
            _setupSandbox(t)

            if (before) {
                before(t)
            }

            cb(t)

            if (after) {
                after(t)
            }

            _teardownSandbox(t)
        })

        return t
    }

    return registerTest
}
