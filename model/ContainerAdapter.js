import Container from './Container'

class ContainerAdapter extends Container {

    constructor(doc, path) {
        super(doc, {id: String(path)})
        this.document = doc
        this.path = path

        // HACK: putting this into a place so that doc.get(this.id) works
        // Hopefully this won't hurt :/
        doc.data.nodes[this.id] = this
    }

    getContentPath() {
        return this.path
    }

    get nodes() {
        return this.document.get(this.path)
    }

    get _isDocumentNode() {
        return false
    }

    get _isContainer() {
        return false
    }

}

export default ContainerAdapter
