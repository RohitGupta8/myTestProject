import BrowserDOMElement from './BrowserDOMElement'

/*
  A wrapper for native DOM events when using event delegation via
  `DOMElement.on(eventName, selector, handler)`.

  @param [Component] owner
  @param [Element] selectedTarget native DOM element
  @param [Event] originalEvent native DOM event
*/
class DelegatedEvent {

    constructor(owner, selectedTarget, originalEvent) {
        this.owner = owner
        this.target = selectedTarget
        this.originalEvent = originalEvent
    }

    static delegatedHandler(listener, top) {
        let handler = listener.handler
        let context = listener.context
        let selector = listener.options.selector
        return function(event) {
            let el = BrowserDOMElement.wrapNativeElement(event.target)
            while (el) {
                if (el.is(selector)) {
                    handler(new DelegatedEvent(context, event.target, event))
                    break
                }
                if (el === top) {
                    break
                }
                el = el.parentNode
            }
        }
    }
}

export default DelegatedEvent
