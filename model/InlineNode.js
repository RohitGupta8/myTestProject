import PropertyAnnotation from './PropertyAnnotation'

class InlineNode extends PropertyAnnotation {

    get _isInlineNode() {
        return true
    }
}

InlineNode.isInline = true

export default InlineNode
