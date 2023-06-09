import isString from '../util/isString'
import isNumber from '../util/isNumber'
import DOMElement from './DOMElement'
import DOMEventListener from './DOMEventListener'
import DelegatedEvent from './DelegatedEvent'

class BrowserDOMElement extends DOMElement {

    constructor(el) {
        super()
        this.el = el
        el._wrapper = this
    }

    getNativeElement() {
        return this.el
    }

    hasClass(className) {
        return this.el.classList.contains(className)
    }

    addClass(className) {
        this.el.classList.add(className)
        return this
    }

    removeClass(className) {
        this.el.classList.remove(className)
        return this
    }

    getAttribute(name) {
        return this.el.getAttribute(name)
    }

    setAttribute(name, value) {
        this.el.setAttribute(name, value)
        return this
    }

    removeAttribute(name) {
        this.el.removeAttribute(name)
        return this
    }

    getAttributes() {
        let result = {}
        let attributes = this.el.attributes
        let l = attributes.length
        for (let i = 0; i < l; i++) {
            let attr = attributes.item(i)
            result[attr.name] = attr.value
        }
        return result
    }

    getProperties() {
        let properties = {}
        this.changedProperties.forEach((name) => {
            properties[name] = this.el[name]
        })
        return properties
    }

    getProperty(name) {
        return this.el[name]
    }

    setProperty(name, value) {
        this.changedProperties.add(name)
        this.el[name] = value
        return this
    }

    removeProperty(name) {
        this.changedProperties.delete(name)
        delete this.el[name]
        return this
    }

    getTagName() {
        // it is convenient in HTML mode to always use tagName in lower case
        // however, in XML this is not allowed, as tag names are case sensitive there
        if (this._isXML()) {
            return this.el.tagName
        } else if (this.el.tagName) {
            return this.el.tagName.toLowerCase()
        }
    }

    setTagName(tagName) {
        let newEl = this.createElement(tagName)
        let attributes = this.el.attributes
        let l = attributes.length
        let i
        for (i = 0; i < l; i++) {
            let attr = attributes.item(i)
            newEl.setAttribute(attr.name, attr.value)
        }
        this.changedProperties.forEach((name) => {
            newEl[name] = this.el[name]
        })
        this.eventListeners.forEach(function(listener) {
            newEl.addEventListener(listener.eventName, listener.handler, listener.capture)
        })

        newEl.append(this.getChildNodes())

        this._replaceNativeEl(newEl.getNativeElement())
        return this
    }

    getId() {
        return this.el.id
    }

    setId(id) {
        this.el.id = id
        return this
    }

    getStyle(name) {
        // NOTE: important to provide computed style, otherwise we don't get inherited styles
        let style = this.getComputedStyle()
        return style[name] || this.el.style[name]
    }

    getComputedStyle() {
        return window.getComputedStyle(this.el)
    }

    setStyle(name, value) {
        if (DOMElement.pxStyles[name] && isNumber(value)) value = value + 'px'
        this.el.style[name] = value
        return this
    }

    getTextContent() {
        return this.el.textContent
    }

    setTextContent(text) {
        this.el.textContent = text
        return this
    }

    getInnerHTML() {
        let innerHTML = this.el.innerHTML
        if (!isString(innerHTML)) {
            let frag = this.el.ownerDocument.createDocumentFragment()
            for (let c = this.el.firstChild; c; c = c.nextSibling) {
                frag.appendChild(c.cloneNode(true))
            }
            let xs = new window.XMLSerializer()
            innerHTML = xs.serializeToString(frag)
        }
        return innerHTML
    }

    setInnerHTML(html) {
        this.el.innerHTML = html
        return this
    }

    getOuterHTML() {
        let outerHTML = this.el.outerHTML
        if (!isString(outerHTML)) {
            let xs = new window.XMLSerializer()
            outerHTML = xs.serializeToString(this.el)
        }
        return outerHTML
    }

    addEventListener(eventName, handler, options) {
        let listener
        if (arguments.length === 1 && arguments[0]) {
            listener = arguments[0]
        } else {
            listener = new DOMEventListener(eventName, handler, options)
        }
        if (listener.options.selector && !listener.__hasEventDelegation__) {
            listener.handler = DelegatedEvent.delegatedHandler(listener, this.getNativeElement())
            listener.__hasEventDelegation__ = true
        }
        this.el.addEventListener(listener.eventName, listener.handler, listener.capture)
        this.eventListeners.push(listener)
        listener._el = this
        return this
    }

    removeEventListener(eventName, handler) {
        let listener = null
        const idx = DOMEventListener.findIndex(this.eventListeners, eventName, handler)
        listener = this.eventListeners[idx]
        if (idx > -1) {
            this.eventListeners.splice(idx, 1)
            listener._el = null
            this.el.removeEventListener(listener.eventName, listener.handler)
        }
        return this
    }

    removeAllEventListeners() {
        for (let i = 0; i < this.eventListeners.length; i++) {
            let listener = this.eventListeners[i]
            listener._el = null
            this.el.removeEventListener(listener.eventName, listener.handler)
        }
        this.eventListeners = []
    }

    getEventListeners() {
        return this.eventListeners
    }

    getChildCount() {
        return this.el.childNodes.length
    }

    getChildNodes() {
        let childNodes = []
        for (let node = this.el.firstChild; node; node = node.nextSibling) {
            childNodes.push(BrowserDOMElement.wrapNativeElement(node))
        }
        return childNodes
    }

    getChildren() {
        // Some browsers don't filter elements here and also include text nodes,
        // that why we can't use el.children
        let children = []
        for (let node = this.el.firstChild; node; node = node.nextSibling) {
            if (node.nodeType === window.Node.ELEMENT_NODE) {
                children.push(BrowserDOMElement.wrapNativeElement(node))
            }
        }
        return children
    }

    getChildAt(pos) {
        return BrowserDOMElement.wrapNativeElement(this.el.childNodes[pos])
    }

    getChildIndex(child) {
        if (!child._isBrowserDOMElement) {
            throw new Error('Expecting a BrowserDOMElement instance.')
        }
        return Array.prototype.indexOf.call(this.el.childNodes, child.el)
    }

    getFirstChild() {
        let firstChild = this.el.firstChild
        if (firstChild) {
            return BrowserDOMElement.wrapNativeElement(firstChild)
        } else {
            return null
        }
    }

    getLastChild() {
        var lastChild = this.el.lastChild
        if (lastChild) {
            return BrowserDOMElement.wrapNativeElement(lastChild)
        } else {
            return null
        }
    }

    getNextSibling() {
        let next = this.el.nextSibling
        if (next) {
            return BrowserDOMElement.wrapNativeElement(next)
        } else {
            return null
        }
    }

    getPreviousSibling() {
        let previous = this.el.previousSibling
        if (previous) {
            return BrowserDOMElement.wrapNativeElement(previous)
        } else {
            return null
        }
    }

    isTextNode() {
        return (this.el.nodeType === window.Node.TEXT_NODE)
    }

    isElementNode() {
        return (this.el.nodeType === window.Node.ELEMENT_NODE)
    }

    isCommentNode() {
        return (this.el.nodeType === window.Node.COMMENT_NODE)
    }

    isDocumentNode() {
        return (this.el.nodeType === window.Node.DOCUMENT_NODE)
    }

    clone() {
        let clone = this.el.cloneNode(true)
        return BrowserDOMElement.wrapNativeElement(clone)
    }

    createDocument(format) {
        return BrowserDOMElement.createDocument(format)
    }

    createElement(tagName) {
        let doc = this._getNativeOwnerDocument()
        let el = doc.createElement(tagName)
        return BrowserDOMElement.wrapNativeElement(el)
    }

    createTextNode(text) {
        let doc = this._getNativeOwnerDocument()
        let el = doc.createTextNode(text)
        return BrowserDOMElement.wrapNativeElement(el)
    }

    createComment(data) {
        let doc = this._getNativeOwnerDocument()
        let el = doc.createComment(data)
        return BrowserDOMElement.wrapNativeElement(el)
    }

    createProcessingInstruction(name, data) {
        let doc = this._getNativeOwnerDocument()
        let el = doc.createProcessingInstruction(name, data)
        return BrowserDOMElement.wrapNativeElement(el)
    }

    createCDATASection(data) {
        let doc = this._getNativeOwnerDocument()
        let el = doc.createCDATASection(data)
        return BrowserDOMElement.wrapNativeElement(el)
    }

    is(cssSelector) {
        if (this.isElementNode()) {
            return this.el.matches(cssSelector)
        } else {
            return false
        }
    }

    getParent() {
        let parent = this.el.parentNode
        if (parent) {
            return BrowserDOMElement.wrapNativeElement(parent)
        } else {
            return null
        }
    }

    getRoot() {
        let el = this.el
        let parent = el
        while (parent) {
            el = parent
            parent = el.parentNode
        }
        return BrowserDOMElement.wrapNativeElement(el)
    }

    getOwnerDocument() {
        return BrowserDOMElement.wrapNativeElement(this._getNativeOwnerDocument())
    }

    _getNativeOwnerDocument() {
        return (this.isDocumentNode() ? this.el : this.el.ownerDocument)
    }

    find(cssSelector) {
        let result = null
        if (this.el.querySelector) {
            result = this.el.querySelector(cssSelector)
        }
        if (result) {
            return BrowserDOMElement.wrapNativeElement(result)
        } else {
            return null
        }
    }

    findAll(cssSelector) {
        let result = []
        if (this.el.querySelectorAll) {
            result = this.el.querySelectorAll(cssSelector)
        }
        return Array.prototype.map.call(result, function(el) {
            return BrowserDOMElement.wrapNativeElement(el)
        })
    }

    _normalizeChild(child) {
        if (child instanceof window.Node) {
            // @ts-ignore: This is not great
            if (!child._wrapper) {
                child = BrowserDOMElement.wrapNativeElement(child)
            } else {
                return child
            }
        }
        if (isString(child) || isNumber(child)) {
            child = this.createTextNode(child)
        }
        if (!child || !child._isBrowserDOMElement) {
            throw new Error('Illegal child type.')
        }
        // HACK: I thought it isn't possible to create
        // a BrowserDOMElement instance without having this
        // done already
        if (!child.el._wrapper) {
            child.el._wrapper = child
        }
        console.assert(child.el._wrapper === child, "The backlink to the wrapper should be consistent")
        return child.getNativeElement()
    }

    appendChild(child) {
        let nativeChild = this._normalizeChild(child)
        this.el.appendChild(nativeChild)
        return this
    }

    insertAt(pos, child) {
        let nativeChild = this._normalizeChild(child)
        let childNodes = this.el.childNodes
        if (pos >= childNodes.length) {
            this.el.appendChild(nativeChild)
        } else {
            this.el.insertBefore(nativeChild, childNodes[pos])
        }
        return this
    }

    insertBefore(child, before) {
        if (!before || !before._isBrowserDOMElement) {
            throw new Error('insertBefore(): Illegal arguments. "before" must be a BrowserDOMElement instance.')
        }
        var nativeChild = this._normalizeChild(child)
        this.el.insertBefore(nativeChild, before.el)
        return this
    }

    removeAt(pos) {
        this.el.removeChild(this.el.childNodes[pos])
        return this
    }

    removeChild(child) {
        if (!child || !child._isBrowserDOMElement) {
            throw new Error('removeChild(): Illegal arguments. Expecting a BrowserDOMElement instance.')
        }
        this.el.removeChild(child.el)
        return this
    }

    replaceChild(oldChild, newChild) {
        if (!newChild || !oldChild ||
            !newChild._isBrowserDOMElement || !oldChild._isBrowserDOMElement) {
            throw new Error('replaceChild(): Illegal arguments. Expecting BrowserDOMElement instances.')
        }
        // Attention: Node.replaceChild has weird semantics
        this.el.replaceChild(newChild.el, oldChild.el)
        return this
    }

    empty() {
        // http://jsperf.com/empty-an-element/4 suggests that this is the fastest way to
        // clear an element
        let el = this.el
        while (el.lastChild) {
            el.removeChild(el.lastChild)
        }
        return this
    }

    remove() {
        if (this.el.parentNode) {
            this.el.parentNode.removeChild(this.el)
        }
        return this
    }

    serialize() {
        let outerHTML = this.el.outerHTML
        if (isString(outerHTML)) {
            return outerHTML
        } else {
            let xs = new window.XMLSerializer()
            return xs.serializeToString(this.el)
        }
    }

    isInDocument() {
        let el = this.el
        while (el) {
            if (el.nodeType === window.Node.DOCUMENT_NODE) {
                return true
            }
            el = el.parentNode
        }
    }

    _replaceNativeEl(newEl) {
        console.assert(newEl instanceof window.Node, "Expecting a native element.")
        let oldEl = this.el
        let parentNode = oldEl.parentNode
        if (parentNode) {
            parentNode.replaceChild(newEl, oldEl)
        }
        this.el = newEl
        // HACK: we need the correct backlink
        this.el._wrapper = this
    }

    _getChildNodeCount() {
        return this.el.childNodes.length
    }

    focus() {
        this.el.focus()
        return this
    }

    blur() {
        this.el.focus()
        return this
    }

    click() {
        this.el.click()
        return this
    }

    getWidth() {
        let rect = this.el.getClientRects()[0]
        if (rect) {
            return rect.width
        } else {
            return 0
        }
    }

    getHeight() {
        let rect = this.el.getClientRects()[0]
        if (rect) {
            return rect.height
        } else {
            return 0
        }
    }

    getOffset() {
        let rect = this.el.getBoundingClientRect()
        return {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        }
    }

    getPosition() {
        return {left: this.el.offsetLeft, top: this.el.offsetTop}
    }

    getOuterHeight(withMargin) {
        let outerHeight = this.el.offsetHeight
        if (withMargin) {
            let style = this.getComputedStyle()
            outerHeight += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10)
        }
        return outerHeight
    }

    _isXML() {
        return this._getNativeOwnerDocument().contentType === 'application/xml'
    }

    static createDocument(format) {
        let doc
        if (format === 'xml') {
            // HACK: didn't find a way to create an empty XML doc without a root element
            doc = window.document.implementation.createDocument(null, 'dummy')
            // remove the
            doc.removeChild(doc.firstChild)
        } else {
            doc = (new window.DOMParser()).parseFromString(DOMElement.EMPTY_HTML, 'text/html')
        }
        return BrowserDOMElement.wrapNativeElement(doc)
    }

    static createElement(tagName) {
        return BrowserDOMElement.wrapNativeElement(
            window.document.createElement(tagName)
        )
    }

    static createTextNode(text) {
        return BrowserDOMElement.wrapNativeElement(
            window.document.createTextNode(text)
        )
    }

    static parseMarkup(str, format, isFullDoc) {
        let nativeEls = []
        let doc
        if (!str) {
            return BrowserDOMElement.createDocument(format)
        } else {
            let parser = new window.DOMParser()
            if (format === 'html') {
                isFullDoc = (str.search(/<\s*html/i) >= 0)
                doc = parser.parseFromString(str, 'text/html')
            } else if (format === 'xml') {
                doc = parser.parseFromString(str, 'text/xml')
            }
            if (doc) {
                let parserError = doc.querySelector('parsererror')
                if (parserError) {
                    throw new Error("ParserError: could not parse " + str)
                }
                if (format === 'html') {
                    if (isFullDoc) {
                        nativeEls = [doc.querySelector('html')]
                    } else {
                        // if the provided html is just a partial
                        // then DOMParser still creates a full document
                        // thus we pick the body and provide its content
                        let body = doc.querySelector('body')
                        nativeEls = [...body.childNodes]
                    }
                } else if (format === 'xml') {
                    if (isFullDoc) {
                        nativeEls = [doc]
                    } else {
                        nativeEls = [...doc.childNodes]
                    }
                }
            } else {
                throw new Error('Could not parse DOM string.')
            }
        }
        let elements = Array.prototype.map.call(nativeEls, function(el) {
            return new BrowserDOMElement(el)
        })
        if (elements.length === 1) {
            return elements[0]
        } else {
            return elements
        }
    }

    static parseHTML(html, isFullDoc) {
        return BrowserDOMElement.parseMarkup(html, 'html', isFullDoc)
    }

    static parseXML(html, isFullDoc) {
        return BrowserDOMElement.parseMarkup(html, 'xml', isFullDoc)
    }

    static wrapNativeElement(el) {
        if (el) {
            if (el._wrapper) {
                return el._wrapper
            } else if (el instanceof window.Node) {
                if (el.nodeType === 3) {
                    return new BrowserTextNode(el)
                } else {
                    return new BrowserDOMElement(el)
                }
            } else if (el === window) {
                return BrowserDOMElement.getBrowserWindow()
            }
        } else {
            return null
        }
    }

    static isReverse(anchorNode, anchorOffset, focusNode, focusOffset) {
        // the selection is reversed when the focus propertyEl is before
        // the anchor el or the computed charPos is in reverse order
        if (focusNode && anchorNode) {

            // @ts-ignore: This is stupid
            if (!BrowserDOMElement.isReverse._r1) {
                // @ts-ignore: This is stupid
                BrowserDOMElement.isReverse._r1 = window.document.createRange()
                // @ts-ignore: This is stupid
                BrowserDOMElement.isReverse._r2 = window.document.createRange()
            }

            // @ts-ignore: This is stupid
            const _r1 = BrowserDOMElement.isReverse._r1
            // @ts-ignore: This is stupid
            const _r2 = BrowserDOMElement.isReverse._r2

            _r1.setStart(anchorNode.getNativeElement(), anchorOffset)
            _r2.setStart(focusNode.getNativeElement(), focusOffset)
            let cmp = _r1.compareBoundaryPoints(window.Range.START_TO_START, _r2)

            if (cmp === 1) {
                return true
            }
        }

        return false
    }

    static getBrowserWindow() {
        if (window.__BrowserDOMElementWrapper__) {
            return window.__BrowserDOMElementWrapper__
        }
        return new BrowserWindow()
    }

    static getWindowSelection() {
        let nativeSel = window.getSelection()
        let result = {
            anchorNode: BrowserDOMElement.wrapNativeElement(nativeSel.anchorNode),
            anchorOffset: nativeSel.anchorOffset,
            focusNode: BrowserDOMElement.wrapNativeElement(nativeSel.focusNode),
            focusOffset: nativeSel.focusOffset
        }
        return result
    }

    get childNodes() {
        return this.getChildNodes()
    }

    get children() {
        return this.getChildren()
    }

    get eventListeners() {
        if (!this._eventListeners) {
            this._eventListeners = []
        }
        return this._eventListeners
    }

    set eventListeners(val) {
        this._eventListeners = val
    }

    get changedProperties() {
        if (!this._changedProperties) {
            this._changedProperties = new Set()
        }
        return this._changedProperties
    }

    get ownerDocument() {
        return this.getOwnerDocument()
    }

    get _isBrowserDOMElement() {
        return true
    }

}

class BrowserTextNode extends BrowserDOMElement {

    constructor(nativeEl) {
        super(nativeEl)
        if (!(nativeEl instanceof window.Node) || nativeEl.nodeType !== 3) {
            throw new Error('Expecting native TextNode')
        }
    }

    getNodeType() {
        return 'text'
    }

}

/*
  Wrapper for the window element exposing DOMElement's EventListener API.
*/
class BrowserWindow {

    constructor() {
        // Note: not
        this.el = window
        window.__BrowserDOMElementWrapper__ = this
        this.eventListeners = []
    }

    get on() {
        return BrowserDOMElement.prototype.on
    }

    get off() {
        return BrowserDOMElement.prototype.off
    }

    get addEventListener() {
        return BrowserDOMElement.prototype.addEventListener
    }

    get removeEventListener() {
        return BrowserDOMElement.prototype.removeEventListener
    }

    get getEventListeners() {
        return BrowserDOMElement.prototype.getEventListeners
    }
}

export default BrowserDOMElement
