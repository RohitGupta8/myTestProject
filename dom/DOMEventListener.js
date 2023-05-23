import isFunction from '../util/isFunction'
import isString from '../util/isString'
import findIndex from '../util/findIndex'

/*
  Internal implementation used to store event bindings.
*/
class DOMEventListener {

    constructor(eventName, handler, options) {
        if (!isString(eventName) || !isFunction(handler)) {
            throw new Error("Illegal arguments: 'eventName' must be a String, and 'handler' must be a Function.")
        }
        options = options || {}
        var origHandler = handler
        var context = options.context
        var capture = Boolean(options.capture)

        if (context) {
            handler = handler.bind(context)
        }
        if (options.once === true) {
            handler = _once(this, handler)
        }

        this.eventName = eventName
        this.originalHandler = origHandler
        this.handler = handler
        this.capture = capture
        this.context = context
        this.options = options
        // set when this gets attached to a DOM element
        this._el = null
    }

    /**
     * @param {any[]} eventListeners
     * @param {string|DOMEventListener} event
     * @param {CallableFunction} handler
     * @returns
     */
    static findIndex(eventListeners, event, handler) {
        if (typeof event === 'string') {
            return findIndex(eventListeners,
                _matches.bind(null, {
                    eventName: event,
                    originalHandler: handler
                })
            )
        }
        else if (event._isDOMEventListener) {
            return eventListeners.indexOf(event)
        }
    }

    get _isDOMEventListener() {
        return true
    }
}

function _matches(l1, l2) {
    return l1.eventName === l2.eventName && l1.originalHandler === l2.originalHandler
}

function _once(listener, handler) {
    return function(event) {
        handler(event)
        listener._el.removeEventListener(listener)
    }
}

export default DOMEventListener
