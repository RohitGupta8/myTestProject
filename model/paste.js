import isArray from '../util/isArray'
import last from '../util/last'
import forEach from '../util/forEach'
import uuid from '../util/uuid'
import Document from '../model/Document'
import documentHelpers from '../model/documentHelpers'
import annotationHelpers from '../model/annotationHelpers'
import {setCursor} from '../model/selectionHelpers'

/**
  Pastes clipboard content at the current selection

  @param {Object} args object with `selection` and `doc` for Substance content or
  `text` for external HTML content
  @return {Object} with updated `selection`
*/

function paste(tx, args) {
    let sel = tx.selection
    if (!sel || sel.isNull()) {
        throw new Error("Can not paste, without selection.")
    }
    args = args || {}
    args.text = args.text || ''
    let pasteDoc = args.doc
    // TODO: is there a better way to detect that this paste is happening within a
    // container?
    let inContainer = Boolean(sel.containerId)

    // when we are in a container, we interpret line-breaks
    // and create a document with multiple paragraphs
    // in a PropertyEditor we paste the text as is
    if (!pasteDoc && !inContainer) {
        tx.insertText(args.text)
        return
    }

    if (!pasteDoc) {
        pasteDoc = _convertPlainTextToDocument(tx, args)
    }

    if (!sel.isCollapsed()) {
        tx.deleteSelection()
    }

    let nodes = pasteDoc.get(Document.SNIPPET_ID).nodes
    let schema = tx.getSchema()

    if (nodes.length > 0) {

        let first = pasteDoc.get(nodes[0])

        if (first._disableCopy === true) {
            // HACK: this changes the container's nodes array.
            // Remove the first node if it's not allowed to be copied
            nodes.shift()
        }

        // If all nodes is selected notToPasteInto will return undefined
        const nodeToPasteInto = tx.get(sel.start.path)
        // Length of node, if undefined set 0
        const nodeToPasteIntoLength = nodeToPasteInto ? nodeToPasteInto.length : 0

        if (schema.isInstanceOf(first.type, 'text') && nodeToPasteIntoLength !== 0) {
            _pasteAnnotatedText(tx, pasteDoc)
            // HACK: this changes the container's nodes array.
            // We do this, to be able to call _pasteDocument inserting the remaining nodes
            nodes.shift()
        }

        if (schema.isInstanceOf(first.type, 'text') && nodeToPasteIntoLength === 0) {
            const isList = sel.path.find(value => value.includes('list'))
            const isTextSnippet = Object.keys(first.document.data.nodes).find(val => val.includes('text-snippet'))
            
            if (isList || isTextSnippet) {
                _pasteAnnotatedText(tx, pasteDoc)
                nodes.shift()
            }
        }

        if (schema.isInstanceOf(first.type, 'list') && nodeToPasteIntoLength === 0) {
            const isList = sel.path.find(value => value.includes('list'))
            const isTextSnippet = sel.path.find(value => value.includes('paragraph'))

            if (isList && !isTextSnippet) {
                pasteIntoList(tx, pasteDoc)
                nodes.shift()
            }
        }

        // if still nodes left > 0
        if (nodes.length > 0 && inContainer) {
            _pasteDocument(tx, pasteDoc)
        }else {
            while(nodes.length > 0){
                let i = 0
                let nodeToCheck = pasteDoc.get(nodes[i])
                if (nodeToCheck.isList()) {
                    pasteListItem(tx, pasteDoc);
                }else {
                    _pasteAnnotatedText(tx, pasteDoc);
                }
                nodes.shift();
                i++
            }
        }
    }

    return args
}

/*
  Splits plain text by lines and puts them into paragraphs.
*/
function _convertPlainTextToDocument(tx, args) {
    let lines = args.text.split(/\s*[\r\n]\s*/)
    let pasteDoc = tx.getDocument().newInstance()
    let defaultTextType = pasteDoc.getSchema().getDefaultTextType()
    let container = pasteDoc.create({
        type: 'container',
        id: Document.SNIPPET_ID,
        nodes: []
    })
    let node
    if (lines.length === 1) {
        node = pasteDoc.create({
            id: Document.TEXT_SNIPPET_ID,
            type: defaultTextType,
            content: lines[0]
        })
        container.show(node.id)
    } else {
        for (let i = 0; i < lines.length; i++) {
            node = pasteDoc.create({
                id: uuid(defaultTextType),
                type: defaultTextType,
                content: lines[i]
            })
            container.show(node.id)
        }
    }
    return pasteDoc
}

function _pasteAnnotatedText(tx, copy) {
    let sel = tx.selection
    let nodes = copy.get(Document.SNIPPET_ID).nodes
    let textPath = [nodes[0], 'content']
    let text = copy.get(textPath)
    let annotations = copy.getIndex('annotations').get(textPath)
    // insert plain text
    let path = sel.start.path
    let offset = sel.start.offset
    tx.insertText(text)
    let inContainer = Boolean(sel.containerId)

    // copy annotations
    if(inContainer) {
        forEach(annotations, function(anno) {
            let data = anno.toJSON()
            data.start.path = path.slice(0)
            data.start.offset += offset
            data.end.offset += offset
            // create a new uuid if a node with the same id exists already
            if (tx.get(data.id)) data.id = uuid(data.type)
            tx.create(data)
        })
    } else {
        const annotaionArray = []
        const strongNode = annotations.find(val => val.id.includes('strong'))
        annotaionArray.push(strongNode)
        const emphasisNode = annotations.find(val => val.id.includes('emphasis'))
        annotaionArray.push(emphasisNode)
        const link = annotations.find(val => val.id.includes('link'))
        annotaionArray.push(link)
        const newAnnotation = annotaionArray.filter(item => item)
        forEach(newAnnotation, function(anno) {
            let data = anno.toJSON()
            data.start.path = path.slice(0)
            data.start.offset += offset
            data.end.offset += offset
            // create a new uuid if a node with the same id exists already
            if (tx.get(data.id)) data.id = uuid(data.type)
            tx.create(data)
        })
    }
}

function _pasteDocument(tx, pasteDoc) {
    const sel = tx.selection
    const containerId = sel.containerId
    const container = tx.get(containerId)
    const nodeId = sel.start.getNodeId()
    const startPos = container.getPosition(nodeId, 'strict')
    const firstNode = container.getNodeAt(startPos)

    let insertPos

    if (sel.isPropertySelection() || sel.isContainerSelection()) {

        let startPath = sel.start.path
        let text = tx.get(startPath)

        if (text.length === 0) {
            insertPos = startPos
            container.hide(nodeId)
            documentHelpers.deleteNode(tx, tx.get(nodeId))
        } else if (text.length === sel.start.offset) {
            insertPos = startPos + 1
        } else if (text.length > 0 && sel.start.offset === 0) {
            insertPos = startPos
        } else {
            tx.break()
            insertPos = startPos + 1
        }
    }
    else if (sel.isNodeSelection()) {
        let nodePos = container.getPosition(sel.getNodeId(), 'strict')
        if (sel.isBefore()) {
            insertPos = nodePos
        } else if (sel.isAfter()) {
            insertPos = nodePos + 1
        } else {
            throw new Error('Illegal state: the selection should be collapsed.')
        }
    }

    if (firstNode.isList()) {
        pasteIntoList(tx, pasteDoc)
    }
    else {
        // transfer nodes from content document
        let nodeIds = pasteDoc.get(Document.SNIPPET_ID).nodes
        let insertedNodes = []
        let visited = {}

        for (let i = 0; i < nodeIds.length; i++) {
            let node = pasteDoc.get(nodeIds[i])

            if (node._disableCopy === true) {
                // Ignore nodes which are not allowed to be copied
                continue
            }

            // Note: this will on the one hand make sure
            // node ids are changed to avoid collisions in
            // the target doc
            // Plus, it uses reflection to create owned nodes recursively,
            // and to transfer attached annotations.
            let newId = _transferWithDisambiguatedIds(node.getDocument(), tx, node.id, visited)
            // get the node in the targetDocument
            node = tx.get(newId)

            container.show(newId, insertPos++)
            insertedNodes.push(node)
        }
        if (insertedNodes.length > 0) {
            let lastNode = last(insertedNodes)
            setCursor(tx, lastNode, containerId, 'after')
        }
    }

}

function pasteIntoList(tx, pasteDoc) {
    const sel = tx.selection
    const containerId = sel.containerId
    const container = tx.get(containerId)
    const nodeId = sel.start.getNodeId()
    const startPos = container.getPosition(nodeId, 'strict')
    const firstNode = container.getNodeAt(startPos)

    let visited = {}
    let insertPosList = firstNode.getItemPosition(sel.start.path[0])
    let insertedNodes = []
    const nodeIds = pasteDoc.get(Document.SNIPPET_ID).nodes

    nodeIds.forEach(nodeId => {
        let node = pasteDoc.get(nodeId)
        let newId = _transferWithDisambiguatedIds(node.getDocument(), tx, node.id, visited)
        node = tx.get(newId)

        if (node._disableCopy === true) {
            // Ignore nodes which are not allowed to be copied
            return
        }

        if (node.isList()) {
            node.items.forEach(item => {
                const itemPos = node.getItemPosition(item)
                const listNode = node.getItemAt(itemPos)
                const text = listNode.getText()

                const copy = tx.create({
                    type: 'list-item',
                    content: text
                })

                const oldPath = [listNode.id, 'content']
                const newPath = [copy.id, 'content']

                annotationHelpers.transferAnnotations(tx, oldPath, 0, newPath, 0)

                firstNode.insertItemAt(insertPosList, copy.id)
                insertedNodes.push(copy)

                insertPosList++
                console.log("item==============>",item,"position",insertPosList);
            })
        }
        else if (node.isText()) {
            const text = node.getText()

            const copy = tx.create({
                type: 'list-item',
                content: text
            })

            const oldPath = [node.id, 'content']
            const newPath = [copy.id, 'content']

            annotationHelpers.transferAnnotations(tx, oldPath, 0, newPath, 0)

            firstNode.insertItemAt(insertPosList, copy.id)
            insertedNodes.push(copy)
            insertPosList++
        }
    })

    // if (insertedNodes.length > 0) {
    //     let lastNode = insertedNodes[insertedNodes.length - 1]
    //     console.log("last node =========> ",lastNode);
    //     setCursor(tx, lastNode, containerId, 'after')
    // }
}

// We need to disambiguate ids if the target document
// contains a node with the same id.
// Unfortunately, this can be difficult in some cases,
// e.g. other nodes that have a reference to the re-named node
// We only fix annotations for now.
function _transferWithDisambiguatedIds(sourceDoc, targetDoc, id, visited) {
    if (visited[id]) throw new Error('FIXME: dont call me twice')
    const node = sourceDoc.get(id, 'strict')
    let oldId = node.id
    let newId = node.id
    if (targetDoc.contains(node.id)) {
        // change the node id
        newId = uuid(node.type)
        node.id = newId
    }
    visited[id] = node.id
    const annotationIndex = sourceDoc.getIndex('annotations')
    const nodeSchema = node.getSchema()
    // collect annotations so that we can create them in the target doc afterwards
    let annos = []

    // Content object might have text fields, in that case the annotation is set on the top node level
    if (node.isIsolatedNode() === true) {
        let _annos = annotationIndex.get([oldId])
        for (let i = 0; i < _annos.length; i++) {
            let anno = _annos[i]
            if (anno.start.path[0] === oldId) {
                anno.start.path[0] = newId
            }
            if (anno.end.path[0] === oldId) {
                anno.end.path[0] = newId
            }
            annos.push(anno)
        }
    }

    // now we iterate all properties of the node schema,
    // to see if there are owned references, which need to be created recursively,
    // and if there are text properties, where annotations could be attached to
    for (let key in nodeSchema) {
        if (key === 'id' || key === 'type' || !nodeSchema.hasOwnProperty(key)) continue
        const prop = nodeSchema[key]
        const name = prop.name
        // Look for references to owned children and create recursively
        if ((prop.isReference() && prop.isOwned()) || (prop.type === 'file')) {
            // NOTE: we need to recurse directly here, so that we can
            // update renamed references
            let val = node[prop.name]

            // No match, no need to continue
            if (!val) {
                if (!prop.definition.optional) {
                    console.error(`Invalid child node, missing none optional "${prop.name}"`)
                }
                continue
            }

            if (prop.isArray()) {
                _transferArrayOfReferences(sourceDoc, targetDoc, val, visited)
            } else {
                let id = val
                if (!visited[id]) {
                    node[name] = _transferWithDisambiguatedIds(sourceDoc, targetDoc, id, visited)
                }
            }
        }
        // Look for text properties and create annotations in the target doc accordingly
        else if (prop.isText()) {
            let _annos = annotationIndex.get([oldId])
            for (let i = 0; i < _annos.length; i++) {
                let anno = _annos[i]

                if (annos.some(({id}) => anno.id === id) === true) {
                    // Avoid adding duplicate annotations, could happen when copying content objects
                    continue
                }

                if (anno.start.path[0] === oldId) {
                    anno.start.path[0] = newId
                }
                if (anno.end.path[0] === oldId) {
                    anno.end.path[0] = newId
                }
                annos.push(anno)
            }
        }
    }

    targetDoc.create(node)

    for (let i = 0; i < annos.length; i++) {
        _transferWithDisambiguatedIds(sourceDoc, targetDoc, annos[i].id, visited)
    }
    return node.id
}

function _transferArrayOfReferences(sourceDoc, targetDoc, arr, visited) {
    for (let i = 0; i < arr.length; i++) {
        let val = arr[i]
        // multi-dimensional
        if (isArray(val)) {
            _transferArrayOfReferences(sourceDoc, targetDoc, val, visited)
        } else {
            let id = val
            if (id && !visited[id]) {
                arr[i] = _transferWithDisambiguatedIds(sourceDoc, targetDoc, id, visited)
            }
        }
    }
}

//To paste List Item other than container element
function pasteListItem(tx, pasteDoc) {
    const nodes = pasteDoc.get(Document.SNIPPET_ID).nodes;

    nodes.forEach(nodeId => {
        let node = pasteDoc.get(nodeId);

        if (node._disableCopy === true) {
            // Ignore nodes which are not allowed to be copied
            return
        }

        if (node.isList()) {
            node.items.forEach(item => {
                const itemPos = node.getItemPosition(item);
                const listNode = node.getItemAt(itemPos);
                const text = listNode.getText();

                tx.insertText(text);
            });
        }
    });
}

export default paste
