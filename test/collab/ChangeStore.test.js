import testChangeStore from './testChangeStore'
import ChangeStore from '../../collab/ChangeStore'
import {module} from '../utils/testModule'

const test = module('collab/ChangeStore')

function createChangeStore() {
    return new ChangeStore()
}

// Runs the offical backend test suite
testChangeStore(createChangeStore, test)
