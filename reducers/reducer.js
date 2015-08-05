import Immutable from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = Immutable.fromJS({
    add: 'the add url',
    actions: [],
    items: {},
    clientIdCounter: 0
});

function add(state, action) {
    const item = action.get('item');
    const clientId = state.get('clientIdCounter');
    const itemWithId = item.set('clientId', clientId);
    const actionWithId = action.set('item', itemWithId);
    return state
        .update('items', items => {
            return items.set(clientId, itemWithId);
        })
        .set('clientIdCounter', clientId + 1)
        .update('actions', actions => {
            return actions.push(actionWithId);
        });
}

function update(state, action) {
    const clientId = action.getIn(['item', 'clientId']);
    const mergedAction = action.update('item', item => {
        return state.getIn(['items', clientId]).merge(item);
    });
    return state
        .update('items', items => {
            return items.set(clientId, mergedAction.get('item'));
        })
        .update('actions', actions => {
            return actions.push(mergedAction);
        });
}

function serverUpdate(state, action) {
    return state
        .update('items', items => {
            return items.update(action.get('clientId'), item => {
                return item.merge(action.get('item'));
            });
        });
}

function serverStart(state) {
    return state
       .update('actions', actions => {
           return actions.shift();
       });
}

function serverFail(state, action) {
    return state
        .update('actions', actions => {
            return actions.unshift(action.get('action'));
        });
}

export default function reducer(state=initialState, action) {
    switch(action.type) {
    case types.ADD:
        return add(state, Immutable.fromJS(action));
    case types.UPDATE:
        return update(state, Immutable.fromJS(action));
    case types.SERVER_UPDATE:
        return serverUpdate(state, Immutable.fromJS(action));
    case types.SERVER_START:
        return serverStart(state);
    case types.SERVER_FAIL:
        return serverFail(state, Immutable.fromJS(action));
    default:
        return state;
    }
}
