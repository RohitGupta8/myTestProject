/*
 * HTML converter for Blockquote.
 */
export default {

    type: 'blockquote',
    tagName: 'blockquote',

    import: function(el, node, converter) {
        node.content = converter.annotatedText(el, [node.id, 'content'])
    },

    export: function(node, el, converter) {
        el.append(
            converter.annotatedText([node.id, 'content'])
        )
    }

}
