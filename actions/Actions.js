import * as types from '../constants/ActionTypes';

export function add(item) {
    return {
        type: types.ADD,
        item: item
    };
}

export function update(item) {
    return {
        type: types.UPDATE,
        item: item
    };
}
