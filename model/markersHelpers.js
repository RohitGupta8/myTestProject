
import uuid from '../util/uuid'

function insertText(doc, path, startOffset, endOffset, typeover, textLength) {

    if (!doc._editorSession) {
        return
    }

    const markers = doc._editorSession.document.getIndex('markers').get(path) || []

    markers.forEach(marker => {
        const markerStart = marker.start.offset
        const markerEnd = marker.end.offset
        /*
        HACK: This is needed to not get the marker removed when fully selecting marker and typing text
        <-->: marker 
        |--|: area of change
        I: |<-->|  : Create new marker, remove old one
        */

        if (typeover
            && startOffset === markerStart
            && endOffset === markerEnd
        ) {
            const newMarker = marker.toJSON()
            newMarker.id = uuid(marker.type)
            newMarker.end.offset = startOffset + textLength

            doc.delete(marker.id)
            doc.create(newMarker)
        }
    })
}

function transferMarkers(doc, path, offset, newPath, newOffset) {

    const markers = doc._editorSession.document.getIndex('markers').get(path)

    markers.forEach(marker => {
        const isInside = (offset > marker.start.offset && offset < marker.end.offset)

        // 1. if the cursor is inside an marker it gets split
        if (isInside && marker.canSplit()) {
            const newMarker = marker.toJSON()

            newMarker.id = uuid(marker.type)
            newMarker.start.path = newPath
            newMarker.start.offset = newOffset
            newMarker.end.path = newPath
            newMarker.end.offset = newOffset + marker.end.offset - offset

            doc.create(newMarker)
        }
        // 2. if the cursor is before an marker then transfer the marker to the new node by removing the old and create new
        else if (marker.start.offset >= offset) {
            const newMarker = marker.toJSON()

            newMarker.id = uuid(marker.type)
            newMarker.start.path = newPath
            newMarker.start.offset = newOffset + marker.start.offset - offset
            newMarker.end.path = newPath
            newMarker.end.offset = newOffset + marker.end.offset - offset

            doc.delete(marker.id)
            doc.create(newMarker)
        }

    })

}

export default {
    transferMarkers,
    insertText
}