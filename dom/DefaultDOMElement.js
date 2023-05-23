import BrowserDOMElement from './BrowserDOMElement'

/**
  A Bridge to the default DOMElement implementation, either BrowserDOMElement, or MemoryDOMElement.
*/
const DefaultDOMElement = {
    createDocument(format) {
        return BrowserDOMElement.createDocument(format)
    },

    createElement(tagName) {
        return BrowserDOMElement.createElement(tagName)
    },

    createTextNode(text) {
        return BrowserDOMElement.createTextNode(text)
    },

    /*
      A wrapper for Browser's `window` providing
      the DOMElement's eventlistener API.
    */
    getBrowserWindow() {
        return BrowserDOMElement.getBrowserWindow()
    },

    /*
      @param {String} html
      @returns {DOMElement|DOMElement[]}
    */
    parseHTML(html) {
        return BrowserDOMElement.parseHTML(html)
    },

    /*
      @param {String} xml
      @returns {DOMElement|DOMElement[]}
    */
    parseXML(xml, fullDoc) {
        return BrowserDOMElement.parseXML(xml, fullDoc)
    },

    wrapNativeElement(el) {
        return BrowserDOMElement.wrapNativeElement(el)
    },

    wrap(el) {
        return BrowserDOMElement.wrapNativeElement(el)
    },

    isReverse(anchorNode, anchorOffset, focusNode, focusOffset) {
        return BrowserDOMElement.isReverse(anchorNode, anchorOffset, focusNode, focusOffset)
    }
}

export default DefaultDOMElement
