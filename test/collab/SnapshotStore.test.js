import testSnapshotStore from './testSnapshotStore'
import SnapshotStore from '../../collab/SnapshotStore'
import {module} from '../utils/testModule'

const test = module('collab/SnapshotStore')

function createEmptySnapshotStore() {
    return new SnapshotStore()
}

// Runs the offical backend test suite
testSnapshotStore(createEmptySnapshotStore, test)
