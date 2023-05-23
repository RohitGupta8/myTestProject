import isObject from '../util/isObject'
import isFunction from '../util/isFunction'
import isString from '../util/isString'
import isArray from '../util/isArray'
import forEach from '../util/forEach'
import ArrayIterator from '../util/ArrayIterator'

const NOT_IMPLEMENTED = 'This method is not implemented.'

/**
  A unified interface for DOM elements used by Substance.

  @abstract
*/
class DOMElement {

    /*
      The element's id.
      @property {String} DOMElement#id
    */

    /*
      The element's tag name in lower case.
      @property {String} DOMElement#tagName
    */

    /*
      @property {String} DOMElement#textContent
     */

    /*
      The inner HTML string.

      @property {String} DOMElement#innerHTML
     */

    /*
      The outer HTML string.

      @property {String} DOMElement#outerHTML
     */

    /*
      An array of child nodes, including nodes such as TextNodes.

      @property {Array<DOMElement>} DOMElement#childNodes
     */

    /*
      An array of child elements.

      @property {Array<DOMElement>} DOMElement#children children
     */

    /*
      The computed height.

      @property {Array<DOMElement>} DOMElement#height
     */

    /*
      The computed width.

      @property {Array<DOMElement>} DOMElement#width
     */

    /**
      @abstract
      @returns the native element
    */
    getNativeElement() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Checks if a CSS class is set.

      @abstract
      @param {String} className
      @returns {Boolean} true if the CSS class is set
    */
    hasClass(className) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Adds a CSS class.

      @abstract
      @param {String} classString A space-separated string with CSS classes
      @returns {this}
    */
    addClass(classString) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Removes a CSS class.

      @abstract
      @param {String} classString A space-separated string with CSS classes
      @returns {this}
    */
    removeClass(classString) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Shorthand for setting attribute/s

      @abstract
      @param {String} name
      @param {String[]} [arguments] if present the attribute will be set
      @returns {this} this element for chaining
     */
    attr() {
        if (arguments.length === 1) {
            if (isString(arguments[0])) {
                // console.warn('Deprecated. Use getAttribute() instead.')
                // @ts-ignore deprecated. Use directly
                return this.getAttribute(arguments[0])
            } else if (isObject(arguments[0])) {
                forEach(arguments[0], function(value, name) {
                    this.setAttribute(name, value)
                }.bind(this))
            }
        } else if (arguments.length === 2) {
            this.setAttribute(arguments[0], arguments[1])
        }
        return this
    }

    /**
      Removes an attribute.

      @abstract
      @param {String} name
      @returns {this}
    */
    removeAttr(name) {
        var names = name.split(/\s+/)
        if (names.length === 1) {
            this.removeAttribute(name)
        } else {
            names.forEach(function(name) {
                this.removeAttribute(name)
            }.bind(this))
        }
        return this
    }

    /**
      Get the attribute with a given name.

      @abstract
      @returns {String} the attribute's value.
    */
    getAttribute(name) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Set the attribute with a given name.

      @abstract
      @param {String} name attribute's value.
      @param {any} value
      @returns {this}
    */
    setAttribute(name, value) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    removeAttribute(name) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    getAttributes() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Shorthand for setting HTML element properties.

      @abstract
      @param {String} name
      @param {any[]} [arguments] if present the property will be set
      @returns {this} this element for chaining
     */
    htmlProp() {
        if (arguments.length === 1) {
            if (isString(arguments[0])) {
                // console.warn('Deprecated. Use getProperty() instead.')
                // @ts-ignore deprecated. Use directly
                return this.getProperty(arguments[0])
            } else if (isObject(arguments[0])) {
                forEach(arguments[0], function(value, name) {
                    this.setProperty(name, value)
                }.bind(this))
            }
        } else if (arguments.length === 2) {
            this.setProperty(arguments[0], arguments[1])
        }
        return this
    }

    /**
     * @param {string} name
     * @returns {string}
     */
    getProperty(name) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
     * @param {string} name
     * @param {any} value
     */
    setProperty(name, value) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
     * @param {string} name
     */
    removeProperty(name) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Get the tagName of this element.

      @abstract
      @protected
      @note Considered as private API, in favor of the property {DOMElement.prototype.tagName}
      @returns {String} the tag name in lower-case.
     */
    getTagName() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Set the tagName of this element.

      @abstract
      @protected
      @note Considered as private API, in favor of the property {DOMElement.prototype.tagName}
      @param {String} tagName the new tag name
      @returns {this}
    */
    setTagName(tagName) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Get the id of this element.

      @abstract
      @protected
      @note Considered as private API, in favor of the property {DOMElement.prototype.id}
      @returns {String} the id.
     */
    getId() {
        return this.getAttribute('id')
    }

    /**
      Set the id of this element.

      @abstract
      @protected
      @note Considered as private API, in favor of the property {DOMElement.prototype.id}
      @param {String} id the new id
    */
    setId(id) {
        this.setAttribute('id', id)
    }

    /**
      Shorthand for setting the *value* of an element.

      @abstract
      @param {String} [value] The value to set.
      @returns {this} this element for chaining
    */
    val(value) {
        if (arguments.length === 0) {
            // console.warn('Deprecated. Use getValue() instead.')
            // @ts-ignore deprecated. Use directly
            return this.getValue()
        } else {
            this.setValue(value)
            return this
        }
    }

    getValue() {
        return this.getProperty('value')
    }

    setValue(value) {
        this.setProperty('value', value)
        return this
    }

    /**
      Shorthand for setting inline CSS styles.

      @param {String} name the style name
      @param {any[]} [arguments] the style value
      @returns {this} this element for chaining
    */
    css() {
        if (arguments.length === 1) {
            if (isString(arguments[0])) {
                // console.warn('Deprecated. Use getStyle() instead.')
                return this.getStyle(arguments[0])
            } else if (isObject(arguments[0])) {
                forEach(arguments[0], function(value, name) {
                    this.setStyle(name, value)
                }.bind(this))
            } else {
                throw new Error('Illegal arguments.')
            }
        } else if (arguments.length === 2) {
            this.setStyle(arguments[0], arguments[1])
        } else {
            throw new Error('Illegal arguments.')
        }
        return this
    }

    /**
     * @param {string} name
     * @returns {any}
     */
    getStyle(name) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    setStyle(name, value) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Sets the text content of an element.

      @abstract
      @param {String} [text] The text content to set.
      @returns {this} this element for chaining
    */
    text(text) {
        if (arguments.length === 0) {
            // console.warn('Deprecated. Use getTextContent() instead.')
            // @ts-ignore deprecated. Use directly
            return this.getTextContent()
        } else {
            this.setTextContent(text)
        }
        return this
    }

    /**
      Get the textContent of this element.

      @abstract
      @protected
      @note Considered as private API, in favor of the property {DOMElement.prototype.innerHTML}
      @returns {String}
    */
    getTextContent() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Set the textContent of this element.

      @abstract
      @protected
      @note Considered as private API, in favor of the property {DOMElement.prototype.innerHTML}
      @param {String} text the new text content
      @returns {this}
    */
    setTextContent(text) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Shorthand for setting the innerHTML of an element.

      @abstract
      @param {String} [html] The html to set.
      @returns {this} this element for chaining
     */
    html(html) {
        if (arguments.length === 0) {
            // console.warn('Deprecated. Use getInnerHTML() instead.')
            // @ts-ignore deprecated. Use directly
            return this.getInnerHTML()
        } else {
            this.setInnerHTML(html)
        }
        return this
    }

    /**
      Get the innerHTML of this element.

      @abstract
      @protected
      @note Considered as private API, in favor of the property {@link DOMElement.prototype.innerHTML}
      @returns {String}
    */
    getInnerHTML() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Set the innerHTML of this element.

      @abstract
      @protected
      @note Considered as private API, in favor of the property {@link DOMElement.prototype.innerHTML}
      @param {String} html the new text content
      @returns {this}
    */
    setInnerHTML(html) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Get the outerHTML of this element.

      @abstract
      @protected
      @note Considered as private API, in favor of the property {@link DOMElement.prototype.outerHTML}
      @returns {String}
    */
    getOuterHTML() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Registers an Element event handler.

      @param {String} eventName The event name.
      @param {Function} handler The handler function.
      @param {Object} [context] context where the function should be bound to
      @param {Object} [options]
      @param {Object} [options.selector] for event delegation
      @param {Object} [options.capture] to register the event in the event's capture phase (bubbling top-down)
      @param {Object} [options.context] context
      @returns {this}
    */
    on(eventName, handler, context, options) {
        if (!isString(eventName)) {
            throw new Error('Illegal argument: "event" must be a String.')
        }
        options = options || {}
        if (context) {
            options.context = context
        }
        if (options.selector && !isString(options.selector)) {
            throw new Error('Illegal argument: selector must be a string.')
        }
        if (!handler || !isFunction(handler)) {
            throw new Error('Illegal argument: invalid handler function for event ' + eventName)
        }
        this.addEventListener(eventName, handler, options)
        return this
    }

    /**
      Unregisters the handler of a given event.

      @param {String} eventName The event name.
      @returns {this}
    */
    off(eventName, handler) {
        // el.off(this): disconnect all listeners bound to the given context
        if (arguments.length === 1 && !isString(eventName)) {
            let context = arguments[0]
            this.getEventListeners().filter(function(l) {
                return l.context === context
            }).forEach(function(l) {
                this.removeEventListener(l)
            }.bind(this))
        } else {
            this.removeEventListener(eventName, handler)
        }
        return this
    }

    addEventListener(eventName, handler, options) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    removeEventListener(eventName, handler) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
     * @returns {Array<any>}
     */
    getEventListeners() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Gets the type of this element in lower-case.

      @protected
      @note Considered as private API, in favor of the property {@link DOMElement.prototype.nodeType}
      @returns {String}
    */
    getNodeType() {
        if (this.isTextNode()) {
            return "text"
        } else if (this.isCommentNode()) {
            return "comment"
        } else if (this.isElementNode()) {
            return "element"
        } else if (this.isDocumentNode()) {
            return "document"
        } else {
            throw new Error("Unsupported node type")
        }
    }

    getChildCount() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Get child nodes of this element.

      This method provides a new array with wrapped native elements.
      Better use getChildAt().

      @abstract
      @protected Considered as private API, in favor of the property {DOMElement.prototype.childNodes}
      @returns {Array<DOMElement>}
     */
    getChildNodes() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Get child elements of this element.

      This method provides a new array with wrapped native elements.
      Better use getChildAt().

      @abstract
      @protected Considered as private API, in favor of the property {DOMElement.prototype.children}
      @returns {Array<DOMElement>}
     */
    getChildren() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    getChildAt(pos) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    getChildIndex(child) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    getChildNodeIterator() {
        return new ArrayIterator(this.getChildNodes())
    }

    getLastChild() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    getFirstChild() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    getNextSibling() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    getPreviousSibling() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Checks if the element is a TextNode.

      @abstract
      @returns {Boolean} true if the element is of type `Node.TEXT_NODE`
     */
    isTextNode() {
        return false
    }

    /**
      Checks if the element is actually an element as opposed to a node.

      @abstract
      @returns {Boolean} true if the element is of type `Node.ELEMENT_NODE`
     */
    isElementNode() {
        return false
    }

    /**
      Checks if the element is a CommentNode.

      @abstract
      @returns {Boolean} true if the element is of type `Node.COMMENT_NODE`
     */
    isCommentNode() {
        return false
    }

    /**
      Checks if the element is a DocumentNode.

      @abstract
      @returns {Boolean} true if the element is of type `Node.DOCUMENT_NODE`
     */
    isDocumentNode() {
        return false
    }

    /**
      Creates a clone of the current element.

      @abstract
      @returns {DOMElement} A clone of this element.
    */
    clone() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Creates a DOMElement.

      @param {String} str a tag name or an HTML element as string.
      @returns {DOMElement}
    */
    createElement(str) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    createTextNode(text) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Checks if a given CSS selector matches for this element.

      **Attention**
      This method is currently not implemented for {ui/VirtualElement}.
      This means you should use it only in importer implementations.

      @abstract
      @param {String} cssSelector
      @returns {Boolean}
     */
    is(cssSelector) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Get the parent element of this element.

      @abstract
      @returns {DOMElement} the parent element
     */
    getParent() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Get the root ancestor element of this element.

      In the browser this is the `window.document`.

      @abstract
      @returns {DOMElement} the root element
     */
    getRoot() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Get the ownerDocument of this element.

      @abstract
      @returns {DOMElement} the document element
    */
    getOwnerDocument() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Find the first descendant element matching the given CSS selector.
      Note this differs from jQuery.find() that it returns only one element.

      **Attention**
      This method is currently not implemented for {ui/VirtualElement}.
      This means you can use it only in importer implementations, but not in render or exporter implementations.

      @abstract
      @param {String} cssSelector
      @returns {DOMElement} found element
     */
    find(cssSelector) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Find all descendant elements matching the given CSS selector.

      **Attention**
      This method is currently not implemented for {ui/VirtualElement}.
      This means you can use it only in importer implementations, but not in render or exporter implementations.

      @abstract
      @param {String} cssSelector
      @returns {Array<DOMElement>} found elements
     */
    findAll(cssSelector) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Append a child element.

      @param {DOMElement|Array<DOMElement>|String} child An element or text to append
      @returns {this}
     */
    append(child) {
        var children
        if (arguments.length === 1) {
            if (isArray(child)) {
                children = child
            } else {
                this.appendChild(child)
                return this
            }
        } else {
            children = arguments
        }
        if (children) {
            Array.prototype.forEach.call(children, this.appendChild.bind(this))
        }
        return this
    }

    appendChild(child) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Insert a child element at a given position.

      @abstract
      @param {Number} pos insert position
      @param {DOMElement|String} child The child element or text to insert.
      @returns {this}
    */
    insertAt(pos, child) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    insertBefore(newChild, before) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Remove the child at a given position.

      @abstract
      @param {Number} pos
      @returns {this}
    */
    removeAt(pos) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    removeChild(child) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    replaceChild(oldChild, newChild) { // eslint-disable-line no-unused-vars
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    /**
      Removes this element from its parent.
    */
    remove() {
        var parent = this.getParent()
        if (parent) {
            parent.removeChild(this)
        }
    }

    /**
      Removes all child nodes from this element.

      @abstract
      @returns {this}
    */
    empty() {
        /* istanbul ignore next */
        throw new Error(NOT_IMPLEMENTED)
    }

    serialize() {
        return this.getOuterHTML()
    }

    isInDocument() {
        if (this.isDocumentNode()) {
            return true
        }

        let el = this.getParent()
        while (el) {
            if (el.isDocumentNode()) {
                return true
            }
            el = el.getParent()
        }
    }

    /**
      Focusses this element.

      **Attention: this makes only sense for elements which are rendered in the browser**

    */
    focus() {
        return this
    }

    /**
      Blur this element.
    */
    blur() {
        return this
    }

    /**
      Trigger a click event on this element.
    */
    click() {
        return this
    }

    /* API to retrieve layout information */

    getWidth() {
        return 0
    }

    getHeight() {
        return 0
    }

    /**
      Outer height as provided by $.outerHeight(withMargin)
    */
    getOuterHeight(withMargin) { // eslint-disable-line no-unused-vars
        return 0
    }

    /**
      Offset values as provided by $.offset()
    */
    getOffset() {
        return {top: 0, left: 0}
    }

    /**
      Position values as provided by $.position()
    */
    getPosition() {
        return {top: 0, left: 0}
    }

    /**
      Get element factory conveniently

      @example

      var $$ = el.getElementFactory()
      $$('div').append('bla')
    */
    getElementFactory() {
        return this.createElement.bind(this)
    }

    // properties

    get id() {
        return this.getId()
    }

    set id(id) {
        this.setId(id)
    }

    get tagName() {
        return this.getTagName()
    }

    set tagName(tagName) {
        this.setTagName(tagName)
    }

    get nodeName() {
        return this.getTagName()
    }

    get nodeType() {
        return this.getNodeType()
    }

    get className() {
        return this.getAttribute('class')
    }

    set className(className) {
        this.setAttribute('class', className)
    }

    get textContent() {
        return this.getTextContent()
    }

    set textContent(text) {
        this.setTextContent(text)
    }

    get innerHTML() {
        return this.getInnerHTML()
    }

    set innerHTML(html) {
        this.setInnerHTML(html)
    }

    get outerHTML() {
        return this.getOuterHTML()
    }

    get firstChild() {
        return this.getFirstChild()
    }

    get lastChild() {
        return this.getLastChild()
    }

    get nextSibling() {
        return this.getNextSibling()
    }

    get previousSibling() {
        return this.getPreviousSibling()
    }

    get parentNode() {
        return this.getParent()
    }

    get height() {
        return this.getHeight()
    }

    get width() {
        return this.getWidth()
    }

    get _isDOMElement() {
        return true
    }

    static get pxStyles() {
        return {
            top: true,
            bottom: true,
            left: true,
            right: true,
            height: true,
            width: true
        }
    }

    static get EMPTY_HTML() {
        return '<html><head></head><body></body></html>'
    }
}

export default DOMElement
