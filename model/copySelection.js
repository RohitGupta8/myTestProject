import cloneDeep from '../util/cloneDeep'
import forEach from '../util/forEach'
import Document from './Document'
import documentHelpers from './documentHelpers'
import annotationHelpers from '../model/annotationHelpers'
import {isFirst, isLast} from './selectionHelpers'

/**
  Creates a new document instance containing only the selected content

  @param {Object} args object with `selection`
  @return {Object} with a `doc` property that has a fresh doc with the copied content
*/

function copySelection(doc, selection) {
    if (!selection) throw new Error("'selection' is mandatory.")
    let copy = null
    if (!selection.isNull() && !selection.isCollapsed()) {
        // return a simplified version if only a piece of text is selected
        if (selection.isPropertySelection()) {
            copy = _copyPropertySelection(doc, selection)
        }
        else if (selection.isContainerSelection()) {
            copy = _copyContainerSelection(doc, selection)
        }
        else if (selection.isNodeSelection()) {
            copy = _copyNodeSelection(doc, selection)
        }
        else {
            console.error('Copy is not yet supported for selection type.')
        }
    }
    return copy
}

function _copyPropertySelection(doc, selection) {
    const path = selection.start.path
    const offset = selection.start.offset
    const endOffset = selection.end.offset
    const text = doc.get(path)
    const snippet = doc.createSnippet()
    const containerNode = snippet.getContainer()
    const startNode = doc.get(path[0]).getRoot()
    const body = path.find(val => val.includes('content'))
    const list = path.find(val => val.includes('list'))
    const table = path.find(val => val.includes('table'))
    
    if (!table && startNode.isList()
        && offset === 0
        && endOffset) {

        const listItem = snippet.create({
            type: 'list-item',
            content: text
        })

        snippet.create({
            type: 'list',
            id: Document.TEXT_SNIPPET_ID,
            ordered:startNode.ordered,
            items: [listItem.id]
        })

        const listNode = doc.get(path[0])
        const oldPath = [listNode.id, 'content']
        const newPath = [listItem.id, 'content']
        
        annotationHelpers.transferAnnotations(doc, oldPath, 0, newPath, 0)
    }
    else if (body && !list && !table) {
        snippet.create({
            type: startNode.type,
            id: Document.TEXT_SNIPPET_ID,
            content: text.substring(offset, endOffset)
        })
    } else {
        snippet.create({
            type: doc.schema.getDefaultTextType(),
            id: Document.TEXT_SNIPPET_ID,
            content: text.substring(offset, endOffset)
        })
    }

    containerNode.show(Document.TEXT_SNIPPET_ID)
    const annotations = doc.getIndex('annotations').get(path, offset, endOffset)
    forEach(annotations, function(anno) {
        let data = cloneDeep(anno.toJSON())
        let path = [Document.TEXT_SNIPPET_ID, 'content']
        data.start = {
            path: path,
            offset: Math.max(offset, anno.start.offset) - offset
        }
        data.end = {
            path: path,
            offset: Math.min(endOffset, anno.end.offset) - offset
        }
        snippet.create(data)
    })
    return snippet
}

function _copyContainerSelection(doc, sel) {
    let snippet = doc.createSnippet()
    let container = snippet.getContainer()

    let nodeIds = sel.getNodeIds()
    let L = nodeIds.length
    if (L === 0) return snippet

    let start = sel.start
    let end = sel.end

    let skippedFirst = false
    let skippedLast = false

    // First copy the whole covered nodes
    let created = {}
    for (let i = 0; i < L; i++) {
        let id = nodeIds[i]
        let node = doc.get(id)
        // skip NIL selections, such as cursor at the end of first node or cursor at the start of last node.
        if (i === 0 && isLast(doc, start)) {
            skippedFirst = true
            continue
        }
        if (i === L - 1 && isFirst(doc, end)) {
            skippedLast = true
            continue
        }
        if (!created[id]) {
            documentHelpers.copyNode(node).forEach((nodeData) => {
                let copy = snippet.create(nodeData)
                created[copy.id] = true
            })
            container.show(id)
        }
    }
    if (!skippedFirst) {
        // ATTENTION: we need the root node here, e.g. the list, not the list items
        let startNode = snippet.get(start.getNodeId()).getRoot()
        if (startNode.isText()) {
            documentHelpers.deleteTextRange(snippet, null, start)
        } else if (startNode.isList()) {
            documentHelpers.deleteListRange(snippet, startNode, null, start)
        }
    }
    if (!skippedLast) {
        // ATTENTION: we need the root node here, e.g. the list, not the list items
        let endNode = snippet.get(end.getNodeId()).getRoot()
        if (endNode.isText()) {
            documentHelpers.deleteTextRange(snippet, end, null)
        } else if (endNode.isList()) {
            documentHelpers.deleteListRange(snippet, endNode, end, null)
        }
    }
    return snippet
}

function _copyNodeSelection(doc, selection) {
    let snippet = doc.createSnippet()
    let containerNode = snippet.getContainer()
    let nodeId = selection.getNodeId()
    let node = doc.get(nodeId)
    documentHelpers.copyNode(node).forEach((nodeData) => {
        snippet.create(nodeData)
    })
    containerNode.show(node.id)
    return snippet
}


export default copySelection
